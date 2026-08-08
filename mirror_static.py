import os, ssl, urllib.request

OUT = r"C:\Users\Administrator\Desktop\NBPhysics\nbphysics-offline"
ORIGIN = "https://wl.nobook.com"
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE

# index.html 中引用的本地（相对）依赖；CDN 脚本(quill/jweixin/other-login)不下载，离线版注释掉
LOCAL = [
    "assets/nbQuestion/css/main.css",
    "phy.ico",
    "js/webcomponents-bundle.js",
    "js/snap.svg-min.js",
    "js/lodash-4.17.20.min.js",
    "js/jquery-3.2.1.min.js",
    "js/sensorsdata.min-1.22.7.js",
    "js/keyboard.min.js",
    "js/gt.js",
    "assets/libs/tinymce/tinymce.min.js",
    "assets/nb-bootstrap-common-css.js",
    "js/sw.js",
    "assets/nb-utils.min.js",
    "assets/postmate.min.js",
    "manifest.json",
]

ok = 0; fail = []
for rel in LOCAL:
    dest = os.path.join(OUT, rel)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        ok += 1; continue
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    url = ORIGIN + "/" + rel
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
            body = r.read()
        with open(dest, "wb") as f: f.write(body)
        ok += 1
        print(f"  OK {rel} {len(body)//1024}KB")
    except Exception as e:
        fail.append((rel, str(e)[:60]))
        print(f"  FAIL {rel} {str(e)[:60]}")
print(f"DONE ok={ok} fail={len(fail)}")
for rel, e in fail:
    print("   missing:", rel, e)
