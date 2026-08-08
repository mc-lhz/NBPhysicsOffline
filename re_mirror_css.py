"""re_mirror_css.py — 补镜像物理站真实存在的 chunk.css 文件。

背景：物理站 webpack 把每个含样式的 chunk 拆成 <id>.<hash>.chunk.css，与
<id>.<hash>.async.js 一一对应但 hash 不同（CSS 用独立 contenthash）。
离线镜像当时只抓了 .async.js，漏掉了 .chunk.css。同时部分 chunk（共享 hash
31d6cfe0 的，如 24/83/300…）在源站也 404（样式并入 umi.css），这些由 server.py
返回空 CSS 兜底，本脚本只抓【源站 200】的。

用法：python re_mirror_css.py
"""
import os
import re
import ssl
import sys
import urllib.request

import urllib.error

ROOT = os.path.dirname(os.path.abspath(__file__))
ORIGIN = "https://wl.nobook.com"
UMI = os.path.join(ROOT, "umi.575bfdda.js")

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def extract_css_maps(text):
    """从 umi.js 提取所有 "<map>[Q]+\".chunk.css\"" 形式的 CSS 映射。
    返回 {chunkId(int): hash} 的并集。"""
    out = {}
    for m in re.finditer(r'\[Q\]\+"\.chunk\.css"', text):
        i = m.end()
        j = i
        depth = 0
        start = None
        while j > max(0, i - 6000):
            j -= 1
            c = text[j]
            if c == '}':
                depth += 1
            elif c == '{':
                depth -= 1
                if depth < 0:
                    start = j
                    break
        if start is None:
            continue
        snippet = text[start:i]
        for cid, h in re.findall(r'"(\d{2,6})"\s*:\s*"([0-9a-f]{6,10})"', snippet):
            out[int(cid)] = h
    return out


def main():
    with open(UMI, "r", encoding="utf-8", errors="replace") as f:
        text = f.read()
    maps = extract_css_maps(text)
    print(f"[css] 从 umi.js 解析到 {len(maps)} 个 chunk.css 映射")

    ok = 0
    skipped_404 = 0
    errs = []
    for cid, h in sorted(maps.items()):
        fn = f"{cid}.{h}.chunk.css"
        url = f"{ORIGIN}/{fn}"
        out = os.path.join(ROOT, fn)
        if os.path.isfile(out):
            ok += 1
            continue
        try:
            req = urllib.request.Request(
                url, headers={"User-Agent": "Mozilla/5.0", "Referer": ORIGIN + "/"}
            )
            r = urllib.request.urlopen(req, timeout=30, context=ctx)
            data = r.read()
            with open(out, "wb") as f:
                f.write(data)
            ok += 1
            print(f"  + {fn}  ({len(data)}B)")
        except urllib.error.HTTPError as e:
            if e.code == 404:
                # 源站本身也 404（样式已并入 umi.css）→ 交给 server.py 空 CSS 兜底
                skipped_404 += 1
                print(f"  - {fn}  源站404（空 CSS 兜底）")
            else:
                errs.append(f"{fn}: HTTP {e.code}")
        except Exception as e:
            errs.append(f"{fn}: {e}")

    print(f"\n完成：实际落地 {ok} 个 chunk.css；源站404跳过 {skipped_404} 个（空 CSS 兜底）")
    if errs:
        print("非 404 错误：")
        for e in errs:
            print("  !", e)


if __name__ == "__main__":
    main()
