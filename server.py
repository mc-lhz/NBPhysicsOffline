"""NB 物理实验室 离线服务器（由化学离线包 server.py 移植）
    python server.py            # 纯离线，缺的资源记进 missing.log
    python server.py --record   # 录制模式：本地缺啥就去源站抓一份存下来
访问 http://127.0.0.1:8010/physics/new?moduleId=9
"""
import mimetypes
import os
import sys
import time

from flask import Flask, Response, jsonify, request, send_from_directory

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 8010
RECORD = "--record" in sys.argv
ORIGIN = "https://wl.nobook.com"
NB3D_CDN = "https://nobook-test-cdn.noteach.com.cn"

if RECORD:
    import urllib3
    import requests
    urllib3.disable_warnings()
    UP = requests.Session()
    UP.verify = False
    UP.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36",
        "Referer": ORIGIN + "/physics/new",
    })

mimetypes.add_type("application/wasm", ".wasm")
mimetypes.add_type("model/gltf-binary", ".glb")
mimetypes.add_type("application/javascript", ".js")

# 源站本身缺失的图片资源（部分 solid/liquid/gas 图标、PWA manifest 图标等），
# 本地无、回源也 404。为消除控制台重试噪音，对缺失的图片类请求返回 1x1 透明占位。
import base64
TRANSPARENT_PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M8AAAMBAQDJ/pLvAAAAAElFTkSuQmCC"
)
IMG_EXTS = {
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp", ".avif",
    ".cur", ".ico",
}
SVG_PLACEHOLDER = b'<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'


def placeholder_for(path):
    """缺失的图片资源返回透明占位（200），避免引擎反复 ?retry= 刷 404。"""
    ext = os.path.splitext(path.split("?")[0])[1].lower()
    if ext not in IMG_EXTS:
        return None
    if ext == ".svg":
        return Response(SVG_PLACEHOLDER, mimetype="image/svg+xml")
    return Response(TRANSPARENT_PNG, mimetype="image/png")


# ---------- API RECORD / REPLAY ----------
# 浏览器里的 shim 把“内容类”接口（试剂库 / 容器 / 实验数据…）统一 POST 到 /__nbpx，
# 请求体形如 {url, method, body, headers}，url 是还原出来的【真实源站地址】。
#   --record（联网）：回源抓一次真响应，落盘到 fixtures/<key>.json
#   默认（离线）    ：从 fixtures/ 回放；没录到就退回空 ok({})，保证面板不崩
import json as _json
import hashlib as _hashlib
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode

FIXTURES_DIR = os.path.join(ROOT, "fixtures")
os.makedirs(FIXTURES_DIR, exist_ok=True)
FX_INDEX = os.path.join(FIXTURES_DIR, "_index.json")

# 每次请求都会变的 query 参数（时间戳 / 随机数 / 签名），若参与 hash 会导致回放永远 miss
VOLATILE_QS = {
    "_", "t", "ts", "time", "timestamp", "rand", "random", "nonce",
    "sign", "signature", "auth_key", "token", "_t", "cb", "callback", "r",
}

EMPTY_OK = {"code": 0, "status": 0, "errcode": 0, "success": True,
            "message": "ok", "msg": "ok", "data": {}}


def _norm_url(url):
    """剔除易变 query 参数并排序，得到稳定的缓存键。"""
    try:
        p = urlsplit(url)
        qs = sorted((k, v) for k, v in parse_qsl(p.query, keep_blank_values=True)
                    if k.lower() not in VOLATILE_QS)
        return urlunsplit((p.scheme, p.netloc, p.path, urlencode(qs), ""))
    except Exception:
        return url


def _sha(s):
    return _hashlib.sha256(s.encode("utf-8", "replace")).hexdigest()[:40]


def _fx_strict(method, url, body):
    """精确键：方法 + 归一化 URL + 请求体。"""
    return _sha("{}\n{}\n{}".format(method.upper(), _norm_url(url), body or ""))


def _fx_loose(method, url):
    """宽松键：只认 方法 + host + path，用于 query 对不上时的兜底回放。"""
    try:
        p = urlsplit(url)
        return _sha("{}\n{}{}".format(method.upper(), p.netloc, p.path))
    except Exception:
        return _sha(method.upper() + "\n" + url)


def _fx_path(key):
    return os.path.join(FIXTURES_DIR, key + ".json")


def _fx_index_load():
    try:
        with open(FX_INDEX, "r", encoding="utf-8") as f:
            return _json.load(f)
    except Exception:
        return {}


def _fx_write(strict, loose, meta):
    with open(_fx_path(strict), "w", encoding="utf-8") as f:
        _json.dump(meta, f, ensure_ascii=False)
    idx = _fx_index_load()
    idx[strict] = {"url": meta["url"], "method": meta["method"],
                   "loose": loose, "status": meta["status"]}
    with open(FX_INDEX, "w", encoding="utf-8") as f:
        _json.dump(idx, f, ensure_ascii=False, indent=1)


def _fx_read(strict, loose):
    """先按精确键找，找不到再按 host+path 宽松回放。返回 (meta, 命中方式)。"""
    p = _fx_path(strict)
    if os.path.isfile(p):
        try:
            with open(p, "r", encoding="utf-8") as f:
                return _json.load(f), "exact"
        except Exception:
            pass
    for k, v in _fx_index_load().items():
        if v.get("loose") == loose and os.path.isfile(_fx_path(k)):
            try:
                with open(_fx_path(k), "r", encoding="utf-8") as f:
                    return _json.load(f), "loose"
            except Exception:
                continue
    return None, None


def _fx_respond(meta):
    ct = meta.get("content_type") or "application/json"
    raw = (base64.b64decode(meta["body"]) if meta.get("b64")
           else (meta.get("body") or "").encode("utf-8"))
    return Response(raw, status=meta.get("status", 200), mimetype=ct.split(";")[0])


app = Flask(__name__, static_folder=None)
MISSING = set()


def log_missing(path):
    if path in MISSING:
        return
    MISSING.add(path)
    with open(os.path.join(ROOT, "missing.log"), "a", encoding="utf-8") as f:
        f.write(f"{time.strftime('%H:%M:%S')}  {path}\n")
    print(f"  [404] {path}")


@app.after_request
def cors(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Cache-Control"] = "no-store"
    return resp


@app.route("/__nbapi/<path:rest>", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
def mock_api(rest):
    print(f"  [api] {request.method} /__nbapi/{rest}")
    return jsonify({"code": 0, "status": 0, "success": True, "message": "ok", "data": {}})


MISSING_API = set()


def log_missing_api(method, url):
    tag = f"{method} {url}"
    if tag in MISSING_API:
        return
    MISSING_API.add(tag)
    with open(os.path.join(ROOT, "missing_api.log"), "a", encoding="utf-8") as f:
        f.write(f"{time.strftime('%H:%M:%S')}  {tag}\n")
    print(f"  [px-miss] {tag}")


@app.route("/__nbpx", methods=["POST", "OPTIONS"])
def nbpx():
    """内容类接口的录制 / 回放代理。"""
    if request.method == "OPTIONS":
        return Response("", status=204)

    req = request.get_json(force=True, silent=True) or {}
    url = (req.get("url") or "").strip()
    method = (req.get("method") or "GET").upper()
    body = req.get("body") or ""
    headers = req.get("headers") or {}
    if not url.startswith("http"):
        return jsonify(EMPTY_OK)

    strict = _fx_strict(method, url, body)
    loose = _fx_loose(method, url)

    # 已录过就直接回放（录制模式下也复用，避免重复打源站）
    meta, how = _fx_read(strict, loose)
    if meta is not None:
        print(f"  [px-{how}] {method} {url}")
        return _fx_respond(meta)

    # 录制模式：回源抓一次并落盘
    if RECORD:
        try:
            drop = {"host", "content-length", "origin", "referer",
                    "connection", "accept-encoding"}
            hdrs = {k: v for k, v in headers.items() if k.lower() not in drop}
            hdrs.setdefault("Referer", ORIGIN + "/physics/new")
            r = UP.request(method, url, timeout=30, headers=hdrs,
                           data=body.encode("utf-8") if body else None)
            ct = r.headers.get("Content-Type", "application/json")
            try:
                meta = {"url": url, "method": method, "status": r.status_code,
                        "content_type": ct, "b64": False,
                        "body": r.content.decode("utf-8")}
            except UnicodeDecodeError:
                meta = {"url": url, "method": method, "status": r.status_code,
                        "content_type": ct, "b64": True,
                        "body": base64.b64encode(r.content).decode("ascii")}
            _fx_write(strict, loose, meta)
            print(f"  [px-rec] {method} {url} -> {r.status_code} ({len(r.content)}B)")
            return _fx_respond(meta)
        except Exception as e:
            print(f"  [px-err] {method} {url} {e}")

    # 离线且没录到：图片/模型类给占位，其余给空 ok，保证前端不崩
    log_missing_api(method, url)
    try:
        ph = placeholder_for(urlsplit(url).path)
    except Exception:
        ph = None
    return ph if ph is not None else jsonify(EMPTY_OK)


@app.route("/__nbmode")
def nbmode():
    """自检：当前模式 + 已录条数。"""
    return jsonify({
        "record": RECORD,
        "origin": ORIGIN,
        "fixtures_dir": FIXTURES_DIR,
        "fixtures": len(_fx_index_load()),
        "missing_api": sorted(MISSING_API),
    })


@app.route("/__nbfixtures")
def nbfixtures():
    """列出已录制的接口，方便确认试剂/容器数据是否已经拿到。"""
    idx = _fx_index_load()
    return jsonify({
        "count": len(idx),
        "items": [{"key": k, "method": v.get("method"), "status": v.get("status"),
                   "url": v.get("url")} for k, v in idx.items()],
    })


NB3D_DIR = os.path.join(ROOT, "nb3d")
os.makedirs(NB3D_DIR, exist_ok=True)


@app.route("/__nb3d/<path:rest>")
def nb3d(rest):
    """3D 模型 CDN（noteach）代理：本地有就回放；录制模式回源抓取并落盘到 nb3d/。"""
    local = os.path.join(NB3D_DIR, *rest.split("/"))
    if os.path.isfile(local):
        d, n = os.path.split(local)
        return send_from_directory(d, n)
    if RECORD:
        try:
            url = f"{NB3D_CDN}/{rest}"
            if request.query_string:
                url += "?" + request.query_string.decode()
            r = UP.get(url, timeout=60)
            if r.status_code == 200:
                os.makedirs(os.path.dirname(local), exist_ok=True)
                with open(local, "wb") as f:
                    f.write(r.content)
                print(f"  [3d-rec] {rest}  ({len(r.content)}B)")
                ct = r.headers.get("Content-Type", mimetypes.guess_type(rest)[0] or "model/gltf-binary")
                return Response(r.content, mimetype=ct.split(";")[0])
            print(f"  [3d-rec-{r.status_code}] {rest}")
        except Exception as e:
            print(f"  [3d-err] {rest} {e}")
    log_missing("/__nb3d/" + rest)
    return Response("not found", status=404)


SPA_PREFIXES = (
    "chemical", "chemicalPlayer", "chemicalCrystal", "chemicalPrinciple",
    "organicMoleculeDiy", "console", "guidance", "homeworkTask", "homeworkPost",
    "guidTask", "guidPost", "live", "bind", "other", "question", "analysis",
    "physics", "sdkdemotest",
)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    full = os.path.join(ROOT, *path.split("/")) if path else ""
    if path and os.path.isfile(full):
        d, n = os.path.split(full)
        return send_from_directory(d, n)

    first = path.split("/")[0] if path else ""
    # SPA 路由回退
    if not path or first in SPA_PREFIXES:
        # physics 入口缺 moduleId 会导致 app bt[moduleId]=undefined
        # -> "Cannot find module './undefined'" 进不去；自动补默认 moduleId=1（电与磁）
        if first == "physics" and not (request.args.get("moduleId") or "").strip():
            return Response(status=302, headers={"Location": "/physics/new?moduleId=1"})
        return send_from_directory(ROOT, "index.html")

    # 录制模式：回源抓取并落盘
    if RECORD:
        try:
            url = f"{ORIGIN}/{path}"
            if request.query_string:
                url += "?" + request.query_string.decode()
            r = UP.get(url, timeout=30)
            if r.status_code == 200:
                os.makedirs(os.path.dirname(full), exist_ok=True)
                with open(full, "wb") as f:
                    f.write(r.content)
                print(f"  [rec] {path}  ({len(r.content)}B)")
                ct = r.headers.get("Content-Type", mimetypes.guess_type(path)[0] or "application/octet-stream")
                return Response(r.content, mimetype=ct.split(";")[0])
            print(f"  [rec-{r.status_code}] {path}")
        except Exception as e:
            print(f"  [rec-err] {path} {e}")

    # 缺失的图片类资源（源站本身 404，如部分药品图标 / PWA 图标）返回透明占位，
    # 避免引擎带 ?retry= 反复请求刷屏。
    ph = placeholder_for("/" + path)
    if ph is not None:
        return ph

    # 缺失的 CSS（典型的 <id>.<hash>.chunk.css：物理站把样式并入 umi.css，
    # 仅含样式的 chunk 在源站也 404）。返回空 text/css(200)，避免 <link>.onerror
    # 触发 umi.js 里 chunkId 作用域错误的“Loading CSS chunk”ReferenceError。
    if path.lower().endswith(".css"):
        log_missing("/" + path)
        return Response("", status=200, mimetype="text/css")

    # assets/dependJS/*.js 在 wuli_v6.20.12 上源站本身也 404（TweenMax/mousewheel/
    # PIXI/soundjs/nb-phy 已并入 physics-libs*.min.js）。这些由 loadParallel 非阻塞加载，
    # 源站缺它们也能跑，本地同样返回空 JS(200) 即可，避免控制台刷 404 噪音。
    # 注意：只对已确认的“源站也 404 的捆绑产物”兜底，不泛化到所有 .js，以免掩盖
    # 真正缺失的脚本导致更难排查。
    if path.lower().startswith("assets/dependjs/") and path.lower().endswith(".js"):
        log_missing("/" + path)
        return Response("", status=200, mimetype="application/javascript")

    log_missing("/" + path)
    return Response("not found", status=404)


if __name__ == "__main__":
    open(os.path.join(ROOT, "missing.log"), "w").close()
    open(os.path.join(ROOT, "missing_api.log"), "w").close()
    print(f"NB offline lab  ->  http://127.0.0.1:{PORT}/physics/new?moduleId=9")
    print(f"  API 模式: {'RECORD(联网录制)' if RECORD else 'REPLAY(离线回放)'}"
          f"  已录 {len(_fx_index_load())} 条  ->  /__nbmode /__nbfixtures")
    app.run(host="127.0.0.1", port=PORT, threaded=True, debug=False)
