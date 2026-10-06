"""GoXpert "Defect apa harini??" thumbnail — screenshot + texts -> 1080x1920 PNG.

usage: python3 make_thumb.py thumb.json [work_dir]
thumb.json:
  photo    path to the screenshot / photo (required)
  crop     [x, y, w, h] in photo pixels for the red card (optional; default = centred 7:6)
  bg       path for the blurred background (optional; default = photo)
  line1    white headline line — the SYMPTOM question start   e.g. "AIR LAMBAT"
  line2    big yellow line                                     e.g. "TURUN?"
  pill     defect name in Malay                                e.g. "FLOOR TRAP TERSUMBAT"
  sticker  default "AWAS!"
  kicker   default "Defect apa harini??"
  sub      default "Semak sebelum tamat DLP"
  out      output PNG path (default: <work_dir>/thumbnail.png)
  format   "9:16" (default, 1080x1920, grid-safe: all content inside the centre 3:4) or "3:4" (1080x1440)
"""
import html, json, os, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
LOGO = os.path.join(HERE, "..", "goxpert-video", "assets", "logo.png")

if not shutil.which("hyperframes"):
    sys.exit("hyperframes not found — run: npm i -g hyperframes@0.8.132")
cfg = json.load(open(sys.argv[1]))
FMT = cfg.get("format", "9:16")
H = {"3:4": 1440, "9:16": 1920}[FMT]
# 3:4 layout: same design, everything scaled to fit 1440 px height
CSS_34 = """
      #shade { background: linear-gradient(180deg, rgba(252,209,22,1) 0%, rgba(252,209,22,0.97) 27%, rgba(252,209,22,0.5) 36%, rgba(252,209,22,0.12) 44%, rgba(252,209,22,0.12) 64%, rgba(252,209,22,0.6) 71%, rgba(252,209,22,0.97) 77%, rgba(252,209,22,1) 100%); }
      #logo { top: 50px; padding: 14px 24px; border-radius: 22px; }
      #logo img { width: 240px; height: 83px; }
      #head { top: 175px; height: 300px; }
      #h1 { font-size: 112px; }
      #h2 { font-size: 172px; }
      #card { left: 200px; top: 505px; width: 680px; height: 583px; }
      #card-in { border-width: 12px; }
      #sticker { right: 110px; top: 952px; font-size: 80px; padding: 14px 32px 10px; border-width: 7px; }
      #small { top: 1124px; font-size: 54px; }
      #pill { top: 1195px; height: 100px; font-size: 80px; }
      #sub { top: 1322px; font-size: 40px; }"""
# 9:16 = the 3:4 layout moved down 240 px, so everything sits inside the centre 3:4 area that the
# Instagram / TikTok profile grid shows (client screenshot 2026-10-06: logo + pill were cropped).
import re
CSS_916 = re.sub(r"top: (\d+)px", lambda m: f"top: {int(m.group(1)) + 240}px", CSS_34).replace(
    "rgba(252,209,22,0.97) 27%, rgba(252,209,22,0.5) 36%, rgba(252,209,22,0.12) 44%, rgba(252,209,22,0.12) 64%, rgba(252,209,22,0.6) 71%, rgba(252,209,22,0.97) 77%",
    "rgba(252,209,22,0.97) 33%, rgba(252,209,22,0.5) 39.5%, rgba(252,209,22,0.12) 45.5%, rgba(252,209,22,0.12) 60.5%, rgba(252,209,22,0.6) 66%, rgba(252,209,22,0.97) 70%")
base = os.path.dirname(os.path.abspath(sys.argv[1]))
rel = lambda p: p if os.path.isabs(p) else os.path.join(base, p)
work = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else os.path.join(base, "thumb-build"))
os.makedirs(os.path.join(work, "assets"), exist_ok=True)

photo = rel(cfg["photo"])
w, h = map(int, subprocess.check_output(
    ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height",
     "-of", "csv=p=0:s=x", photo], text=True).strip().split("x"))
if cfg.get("crop"):
    cx, cy, cw, ch = cfg["crop"]
else:  # largest centred 7:6 box (card is 880x754)
    cw, ch = (w, int(w * 6 / 7)) if w * 6 / 7 <= h else (int(h * 7 / 6), h)
    cx, cy = (w - cw) // 2, (h - ch) // 2

def ff(*args):
    subprocess.run(["ffmpeg", "-v", "error", "-y", *args], check=True)

ff("-i", photo, "-frames:v", "1", "-vf",
   f"crop={cw}:{ch}:{cx}:{cy},scale=1320:1131:flags=lanczos,cas=strength=0.4", "-q:v", "2",
   os.path.join(work, "assets", "photo.jpg"))
ff("-i", rel(cfg.get("bg", cfg["photo"])), "-frames:v", "1", "-vf",
   f"scale=1080:{H}:force_original_aspect_ratio=increase,crop=1080:{H}", "-q:v", "3",
   os.path.join(work, "assets", "bg.jpg"))
shutil.copy(LOGO, os.path.join(work, "assets", "logo.png"))

e = lambda s: html.escape(s, quote=False)
page = open(os.path.join(HERE, "template.html")).read()
for k, v in {"__LINE1__": cfg["line1"], "__LINE2__": cfg["line2"], "__PILL__": cfg["pill"],
             "__STICKER__": cfg.get("sticker", "AWAS!"), "__KICKER__": cfg.get("kicker", "Defect apa harini??"),
             "__SUB__": cfg.get("sub", "Semak sebelum tamat DLP"), "__H__": str(H)}.items():
    page = page.replace(k, e(v))
page = page.replace("__FORMATCSS__", CSS_34 if FMT == "3:4" else CSS_916)
open(os.path.join(work, "index.html"), "w").write(page)

chk = subprocess.run(["hyperframes", "check"], cwd=work, capture_output=True, text=True)
bad = [l for l in chk.stdout.splitlines() if "✗" in l or "overflow" in l]
print("\n".join(bad) if bad else "check: ok")
shutil.rmtree(os.path.join(work, "snapshots"), ignore_errors=True)
subprocess.run(["hyperframes", "snapshot", "--at", "0.5", "--no-end"], cwd=work, check=True, capture_output=True)
out = rel(cfg["out"]) if cfg.get("out") else os.path.join(work, "thumbnail.png")
shutil.copy(os.path.join(work, "snapshots", "frame-00-at-0.5s.png"), out)
print("thumbnail:", out)
