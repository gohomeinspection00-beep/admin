"""All three platform thumbnails in one go, named so they can't be mixed up.

usage: python3 make_all.py thumb.json <out_dir> <Name>
  -> <out_dir>/TikTok_3x4_<Name>.png   1080x1440 (client: "yang tiktok 4:3 okey sangat")
     <out_dir>/IG_9x16_<Name>.png      1080x1920, content inside the centre 3:4 (IG grid crop)
     <out_dir>/FB_9x16_<Name>.png      1080x1920, same grid-safe layout (also safe for FB's 4:5 feed crop)
thumb.json: same keys as make_thumb.py ("format"/"out" are ignored here).
"""
import json, os, shutil, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
src, out_dir, name = os.path.abspath(sys.argv[1]), os.path.abspath(sys.argv[2]), sys.argv[3]
os.makedirs(out_dir, exist_ok=True)
cfg = json.load(open(src))
base = os.path.dirname(src)
for k in ("photo", "bg"):  # make paths absolute so the temp json works anywhere
    if cfg.get(k) and not os.path.isabs(cfg[k]):
        cfg[k] = os.path.join(base, cfg[k])
work = tempfile.mkdtemp(prefix="thumb-")
made = {}
for fmt in ("3:4", "9:16"):
    c = dict(cfg, format=fmt, out=os.path.join(work, f"{fmt.replace(':', 'x')}.png"))
    j = os.path.join(work, f"{fmt.replace(':', 'x')}.json")
    json.dump(c, open(j, "w"))
    subprocess.run([sys.executable, os.path.join(HERE, "make_thumb.py"), j, os.path.join(work, "build-" + fmt.replace(":", "x"))], check=True)
    made[fmt] = c["out"]
for label, fmt in (("TikTok_3x4", "3:4"), ("IG_9x16", "9:16"), ("FB_9x16", "9:16")):
    dst = os.path.join(out_dir, f"{label}_{name}.png")
    shutil.copy(made[fmt], dst)
    print(dst)
