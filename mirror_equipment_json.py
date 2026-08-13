"""镜像器材/场景配置文件：assets/<module>/<Name><hash>.json (+ _conf.json)

源站：https://wl.nobook.com/assets/<module>/<Name><hash>.json
（assets.nobook.com 不含这些文件；wl.nobook.com 无 CORS，浏览器无法跨域抓，
 但服务端 urllib 可正常下载 —— 故离线包必须预镜像到本地 assets/，运行时不再依赖网络）

文件名清单由本脚本直接扫描本地所有 *.js 得到（自包含，无外部依赖）。
"""
import os
import re
import ssl
import threading
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT = os.path.dirname(os.path.abspath(__file__))
ORIGIN = "https://wl.nobook.com"

CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    "Referer": ORIGIN + "/physics/new",
}

_lock = threading.Lock()
stat = {"ok": 0, "skip": 0, "fail": 0, "bytes": 0}
errors = []

RE1 = re.compile(r"([A-Za-z]+/[A-Za-z][A-Za-z0-9]*[0-9a-f]{32}\.json)")
RE2 = re.compile(r"([A-Za-z]+/[A-Za-z][A-Za-z0-9]*[0-9a-f]{32}_conf\.json)")


def collect():
    found = set()
    for root, _, files in os.walk(ROOT):
        for fn in files:
            if not fn.endswith(".js"):
                continue
            p = os.path.join(root, fn)
            try:
                txt = open(p, encoding="utf-8", errors="replace").read()
            except Exception:
                continue
            for m in RE1.findall(txt):
                found.add(m)
            for m in RE2.findall(txt):
                found.add(m)
    return sorted(found)


def download(rel):
    url = f"{ORIGIN}/assets/{rel}"
    dest = os.path.join(ROOT, "assets", rel)
    if os.path.isfile(dest) and os.path.getsize(dest) > 0:
        with _lock:
            stat["skip"] += 1
        return
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            data = urllib.request.urlopen(req, timeout=40, context=CTX).read()
            with open(dest, "wb") as f:
                f.write(data)
            with _lock:
                stat["ok"] += 1
                stat["bytes"] += len(data)
            return
        except Exception as e:
            if attempt == 2:
                with _lock:
                    stat["fail"] += 1
                    errors.append(f"{rel}: {e}")


def main():
    rels = collect()
    print(f"共 {len(rels)} 个配置文件待处理（扫描本地 *.js）")
    with ThreadPoolExecutor(max_workers=16) as ex:
        futs = [ex.submit(download, r) for r in rels]
        done = 0
        for _ in as_completed(futs):
            done += 1
            if done % 100 == 0:
                print(f"  ... {done}/{len(rels)} ok={stat['ok']} skip={stat['skip']} fail={stat['fail']}")
    print(f"\n完成: 新增 ok={stat['ok']} 跳过 skip={stat['skip']} 失败 fail={stat['fail']} "
          f"新增 {stat['bytes']/1048576:.2f} MB")
    if errors:
        print(f"失败 {len(errors)} 个（前 30 条）:")
        for e in errors[:30]:
            print("  ", e)
        with open(os.path.join(ROOT, "_mirror_equip_fail.txt"), "w", encoding="utf-8") as f:
            f.write("\n".join(errors))


if __name__ == "__main__":
    main()
