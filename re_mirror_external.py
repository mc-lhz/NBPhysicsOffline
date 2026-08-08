import re, os, ssl, urllib.request, time

SRC = r"C:\Users\Administrator\AppData\Local\Temp\wl_umi.js"
OUT = r"C:\Users\Administrator\Desktop\NBPhysics\nbphysics-offline"
ORIGIN = "https://wl.nobook.com"
ctx = ssl.create_default_context(); ctx.check_hostname = False; ctx.verify_mode = ssl.CERT_NONE
data = open(SRC, encoding="utf-8", errors="replace").read()

# 1) JS chunk map id->hash
i = data.find('.async.js'); end = data.rfind('}', 0, i); start = data.rfind('{', 0, end)
jmap = dict(re.findall(r'"(\d{3,4})":"([0-9a-f]{6,8})"', data[start:end+1]))

# 2) external name map id->external_Xxx（来自 miniCssF，全局抓取）
emap = dict(re.findall(r'"(\d{3,4})"\s*:\s*"(external_[A-Za-z]+)"', data))
print("external map:", emap)

plan = []
for cid, name in emap.items():
    h = jmap.get(cid)
    if not h:
        print("  无 hash:", cid, name); continue
    plan.append(f"{name}.{h}.async.js")
    plan.append(f"{name}.{h}.chunk.css")

print("external files to fetch:", len(plan))
ok = 0; fail = []
for rel in plan:
    dest = os.path.join(OUT, rel)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        ok += 1; continue
    url = ORIGIN + "/" + rel
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
            body = r.read()
        with open(dest, "wb") as f: f.write(body)
        ok += 1
        print("  OK", rel, len(body))
    except Exception as e:
        fail.append((rel, str(e)[:60]))
        print("  FAIL", rel, str(e)[:60])
print(f"DONE ok={ok} fail={len(fail)}")
