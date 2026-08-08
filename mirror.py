import os, ssl, urllib.request, time, sys

OUT = r"C:\Users\Administrator\Desktop\NBPhysics\nbphysics-offline"
ORIGIN = "https://wl.nobook.com"
PLAN = os.path.join(OUT, "_download_plan.txt")

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

plan = [l.strip() for l in open(PLAN, encoding="utf-8") if l.strip()]
print(f"plan entries: {len(plan)}")

total = 0
ok = 0
skip = 0
fail = []
t0 = time.time()
for i, rel in enumerate(plan):
    dest = os.path.join(OUT, rel)
    if os.path.exists(dest) and os.path.getsize(dest) > 0:
        skip += 1
        continue
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    url = ORIGIN + "/" + rel
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30, context=ctx) as r:
            body = r.read()
        with open(dest, "wb") as f:
            f.write(body)
        total += len(body)
        ok += 1
    except Exception as e:
        fail.append((rel, str(e)[:80]))
    if (i + 1) % 20 == 0:
        print(f"  {i+1}/{len(plan)} ok={ok} skip={skip} fail={len(fail)} {total//1024}KB")

print(f"DONE ok={ok} skip={skip} fail={len(fail)} total={total//1024}KB in {time.time()-t0:.1f}s")
if fail:
    print("FAILURES:")
    for rel, e in fail[:30]:
        print("  ", rel, e)
    with open(os.path.join(OUT, "_mirror_fail.txt"), "w") as f:
        for rel, e in fail:
            f.write(rel + "\t" + e + "\n")
