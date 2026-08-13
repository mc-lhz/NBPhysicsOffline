#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
补齐器材/场景图集的底座 PNG 贴图（meta.image 指向的精灵图）。
上一轮只镜像了 JSON 配置，漏了它们引用的底座 PNG -> PIXI 加载 1x1 占位 ->
"Texture Error: frame does not fit inside the base Texture dimensions"。

来源：wl.nobook.com/assets/<module>/<image>（与 JSON 同目录，Python 可直连，浏览器不行）。
只采集：图集 JSON 的 meta.image（权威）+ JS 里规范的 <module>/<Name><hex32>.png。
图集 JSON 内部的帧名（b1.png/0.png/on.png 等）是子图，不是独立文件，不采集。
"""
import os, re, json, ssl, urllib.request, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
ORIGIN = "https://wl.nobook.com"
ASSETS = os.path.join(ROOT, "assets")
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
HEADERS = {"User-Agent": "Mozilla/5.0", "Referer": "https://wl.nobook.com/physics/new"}

def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    return urllib.request.urlopen(req, timeout=60, context=ctx).read()

needed = {}

# 1) 图集 JSON 的 meta.image（权威来源）
for module in os.listdir(ASSETS):
    mdir = os.path.join(ASSETS, module)
    if not os.path.isdir(mdir):
        continue
    for fn in os.listdir(mdir):
        if not fn.endswith(".json"):
            continue
        try:
            d = json.load(open(os.path.join(mdir, fn), encoding="utf-8"))
        except Exception:
            continue
        if not isinstance(d, dict):
            continue
        img = (d.get("meta") or {}).get("image")
        if img and "/" not in img and not img.startswith("http"):
            local = os.path.join(mdir, img)
            needed[local] = f"{ORIGIN}/assets/{module}/{img}"

# 2) JS chunks 里规范的器材贴图 <module>/<Name><hex32>.png
js_png = re.compile(r"[a-zA-Z]+/[A-Za-z][A-Za-z0-9]*[0-9a-f]{32}\.png")
try:
    for root, _, files in os.walk(ROOT):
        if "node_modules" in root or os.sep + ".git" in root:
            continue
        for fn in files:
            if not fn.endswith(".js"):
                continue
            try:
                txt = open(os.path.join(root, fn), encoding="utf-8", errors="ignore").read()
            except Exception:
                continue
            for m in js_png.findall(txt):
                local = os.path.join(ASSETS, *m.split("/"))
                needed[local] = f"{ORIGIN}/assets/{m}"
except Exception as e:
    print("walk err:", repr(e)[:120])

print("need PNG count:", len(needed), flush=True)
ok = skip = err = 0
for i, (local, url) in enumerate(sorted(needed.items())):
    if os.path.isfile(local) and os.path.getsize(local) > 16:
        skip += 1
        continue
    try:
        b = fetch(url)
        if len(b) < 16:
            raise ValueError("too small %d" % len(b))
        os.makedirs(os.path.dirname(local), exist_ok=True)
        open(local, "wb").write(b)
        ok += 1
    except Exception as e:
        err += 1
        if err <= 40:
            print("ERR", os.path.relpath(local, ROOT), repr(e)[:70])
    if (i + 1) % 200 == 0:
        print("progress", i + 1, "new", ok, "skip", skip, "err", err, flush=True)
print("DONE new=%d skip=%d err=%d" % (ok, skip, err), flush=True)
