import re, os, ssl, urllib.request, sys

SRC = r"C:\Users\Administrator\AppData\Local\Temp\wl_umi.js"
OUT = r"C:\Users\Administrator\Desktop\NBPhysics\nbphysics-offline"
ORIGIN = "https://wl.nobook.com"

data = open(SRC, encoding="utf-8", errors="replace").read()
print("umi.js chars:", len(data))

idx = data.find('.async.js')
assert idx != -1
end = data.rfind('}', 0, idx)
start = data.rfind('{', 0, end)
obj = data[start:end+1]
print("map head:", obj[:80])
print("map tail:", obj[-80:])

pairs = re.findall(r'"(\d{3,4})":"([0-9a-f]{6,8})"', obj)
seen = {}
for k, v in pairs:
    seen[k] = v
print("unique chunks:", len(seen))
for i, (k, v) in enumerate(seen.items()):
    if i < 8:
        print("   ", k, "->", v)

# 写出待下载清单 (umi + css + nb-config + chunks)
plan = [
    "umi.575bfdda.js",
    "umi.96f4e3ed.css",
    "assets/nb-config.js",
]
for k, v in seen.items():
    plan.append(f"{k}.{v}.async.js")
    plan.append(f"{k}.{v}.chunk.css")

with open(os.path.join(OUT, "_download_plan.txt"), "w") as f:
    f.write("\n".join(plan))
print("total files to download:", len(plan))
print("plan written to _download_plan.txt")
