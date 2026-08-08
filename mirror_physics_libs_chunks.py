"""镜像 physics-libs.min.js 自带的 webpack 分包（physics-libs-chunk/*.min.js）。

physics-libs 是独立于 umi 的第二套 webpack 运行时：
    ne.u = L => "physics-libs-chunk/" + {id: hash, ...}[L] + ".min.js"
每个实验器材/场景按需 lazy-load 其中若干个 chunk，缺一个就抛
    ChunkLoadError: Loading chunk <id> failed
所以这里一次性全量抓下来（单个 1~30KB，总量约十几 MB）。
"""
import os
import re
import ssl
import sys
import threading
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = os.path.dirname(os.path.abspath(__file__))
ORIGIN = "https://wl.nobook.com"
SRC = os.path.join(ROOT, "physics-libs.min.js")
OUTDIR = os.path.join(ROOT, "physics-libs-chunk")

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    "Referer": ORIGIN + "/physics/new",
}


def extract_chunk_map(path):
    """从 physics-libs.min.js 里抠出 {chunkId: contenthash} 映射。"""
    s = open(path, encoding="utf-8", errors="replace").read()
    i = s.find('"physics-libs-chunk/"')
    if i < 0:
        raise SystemExit("未找到 physics-libs-chunk 模板，physics-libs.min.js 可能已换版本")
    j = s.find("{", i)
    depth = 0
    end = None
    for k in range(j, len(s)):
        if s[k] == "{":
            depth += 1
        elif s[k] == "}":
            depth -= 1
            if depth == 0:
                end = k
                break
    blob = s[j:end + 1]
    return re.findall(r'(\d+)\s*:\s*"([0-9a-f]{6,10})"', blob)


_lock = threading.Lock()
stat = {"ok": 0, "skip": 0, "fail": 0, "bytes": 0}


def fetch(item):
    cid, h = item
    name = f"{h}.min.js"
    out = os.path.join(OUTDIR, name)
    if os.path.isfile(out) and os.path.getsize(out) > 0:
        with _lock:
            stat["skip"] += 1
        return None
    url = f"{ORIGIN}/physics-libs-chunk/{name}"
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            data = urllib.request.urlopen(req, timeout=40, context=CTX).read()
            with open(out, "wb") as f:
                f.write(data)
            with _lock:
                stat["ok"] += 1
                stat["bytes"] += len(data)
            return None
        except Exception as e:
            if attempt == 2:
                with _lock:
                    stat["fail"] += 1
                return f"{cid} {name}: {e}"
    return None


def main():
    pairs = extract_chunk_map(SRC)
    # 同一个 hash 可能被多个 chunkId 复用，按文件名去重
    uniq = {}
    for cid, h in pairs:
        uniq.setdefault(h, cid)
    todo = [(cid, h) for h, cid in uniq.items()]
    os.makedirs(OUTDIR, exist_ok=True)
    print(f"chunk 映射 {len(pairs)} 条，去重后 {len(todo)} 个文件 -> {OUTDIR}")

    errors = []
    with ThreadPoolExecutor(max_workers=16) as ex:
        futs = [ex.submit(fetch, t) for t in todo]
        done = 0
        for fu in as_completed(futs):
            err = fu.result()
            if err:
                errors.append(err)
            done += 1
            if done % 200 == 0:
                print(f"  ... {done}/{len(todo)}  ok={stat['ok']} skip={stat['skip']} fail={stat['fail']}")

    print(f"\n完成: ok={stat['ok']} skip={stat['skip']} fail={stat['fail']} "
          f"新增 {stat['bytes']/1048576:.2f} MB")
    if errors:
        print(f"失败 {len(errors)} 个（前 20 条）:")
        for e in errors[:20]:
            print("  ", e)
        with open(os.path.join(ROOT, "_physics_libs_chunk_fail.log"), "w", encoding="utf-8") as f:
            f.write("\n".join(errors))


if __name__ == "__main__":
    main()
