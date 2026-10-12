# GoXpert — "Cara hantar notis guna Pos Daftar + Kad AR" (photo slideshow for Threads). House style: goxpert-video skill.
import re

TPL = "/home/user/admin/.claude/skills/goxpert-video/templates/video-example/template.tpl"
style = re.search(r"<style>(.*?)</style>", open(TPL).read(), re.S).group(1)

CHECK = '<svg viewBox="0 0 24 24" class="ico"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="square"/></svg>'
WARN = '<svg viewBox="0 0 24 24" class="ico"><path d="M12 2.5L23 21.5H1z" fill="currentColor"/><path d="M12 9v6M12 17.2v1.6" stroke="#1d1a33" stroke-width="2.6"/></svg>'

# Each step slide: id, photo, object-position y (0..1), title, body lines, optional highlight box (x,y,w,h in the 1080x1150 photo frame), highlight label
STEPS = [
    ("s1", "p01.jpg", 0.75, "Isi Kad AR (bahagian A)",
     ["Nama & alamat pengirim, poskod,", "no. telefon, nama penerima", "dan tarikh."],
     (60, 420, 480, 520), "BAHAGIAN A"),
    ("s2", "p02.jpg", 0.55, "Sediakan sampul & label",
     ["Label PENERIMA di depan,", "label PENGIRIM di belakang.", "Surat notis di dalam sampul."],
     None, None),
    ("s3", "p07.jpg", 0.55, "Beli pelekat Pos Daftar",
     ["Track-On 9. Boleh beli awal &", "siapkan di rumah, atau terus", "di kaunter pos."],
     None, None),
    ("s4", "p06.jpg", 0.75, "Tampal barcode AR",
     ["Barcode “FOR ARCARD PURPOSES”", "ditampal di ruang No. Pos Daftar.", "Simpan “Customer’s copy”."],
     (190, 600, 400, 110), "FOR ARCARD PURPOSES"),
    ("s5", "p10.jpg", 0.62, "Lekat Kad AR di belakang",
     ["Tanggalkan pita pelekat dan", "lekat Kad AR di belakang", "sampul."],
     None, None),
    ("s6", "p11.jpg", 0.45, "Depan sampul siap",
     ["Label penerima + pelekat", "Pos Daftar + setem."],
     None, None),
    ("s7", "p12.jpg", 0.40, "Hantar & simpan resit",
     ["Simpan resit pengeposan (ada", "cop tarikh) & borang PD1.", "Contoh: 3 surat = RM13.80."],
     (500, 400, 190, 190), "COP TARIKH"),
    ("s8", "p01.jpg", 0.75, "Kad AR dipulangkan",
     ["Penerima tandatangan bahagian B.", "Kad AR dipulangkan kepada anda", "= BUKTI notis diterima."],
     (540, 420, 490, 520), "BAHAGIAN B"),
]
HOOK = 3.2
WHY = 5.6
STEP_D = 4.6
t = HOOK + WHY
SLIDES = []
for i, st in enumerate(STEPS):
    SLIDES.append((t, STEP_D) + st)
    t += STEP_D
END = round(t, 2)
TOTAL = round(END + 3.5, 2)

S = lambda n: f".media/audio/sfx/sfx_{n:03d}.mp3"
SFX = [("h-in", 1, 0.0, 0.6, 0.35), ("h-q", 2, 0.35, 2.0, 0.35), ("h-ans", 5, 1.55, 0.7, 0.35),
       ("w-in", 1, HOOK - 0.15, 0.6, 0.4), ("w-1", 5, HOOK + 1.0, 0.7, 0.3), ("w-2", 5, HOOK + 2.0, 0.7, 0.3), ("w-3", 5, HOOK + 3.0, 0.7, 0.3)]
for k, sl in enumerate(SLIDES):
    st = sl[0]
    SFX += [(f"st{k}-in", 1, round(st - 0.12, 2), 0.6, 0.38), (f"st{k}-snap", 8, round(st + 0.08, 2), 0.4, 0.55),
            (f"st{k}-num", 5, round(st + 0.35, 2), 0.7, 0.3)]
    if sl[8]:
        SFX.append((f"st{k}-hl", 3, round(st + 1.1, 2), 1.3, 0.25))
SFX[-1:] = SFX[-1:]
SFX += [("proof", 6, round(SLIDES[-1][0] + 2.2, 2), 2.1, 0.4),
        ("riser", 9, round(END - 3.3, 2), 3.3, 0.2), ("out", 1, round(END - 0.2, 2), 0.6, 0.45),
        ("end", 2, round(END + 0.35, 2), 2.0, 0.5), ("logo", 4, round(END + 1.5, 2), 1.8, 0.35), ("cta", 5, round(END + 2.2, 2), 0.7, 0.35)]
sfx = "\n".join(f'      <audio id="{i}" src="{S(n)}" data-start="{s}" data-duration="{d}" data-volume="{v}" data-track-index="{20 + k}"></audio>'
                for k, (i, n, s, d, v) in enumerate(SFX))

slides_html, slides_js = [], []
for k, (st, du, sid, photo, py, title, body, hl, hll) in enumerate(SLIDES):
    hl_html = ""
    if hl:
        x, y, w, h = hl
        hl_html = f'<span id="{sid}-hl" class="hl-box" style="left:{x}px;top:{y}px;width:{w}px;height:{h}px"><span class="hl-label">{hll}</span></span>'
    lines = "".join(f'<span class="body-line">{l}</span>' for l in body)
    slides_html.append(f'''      <div id="{sid}" class="slide clip" data-start="{round(st, 2)}" data-duration="{du}" data-track-index="2">
        <div class="photo"><div id="{sid}-wrap" class="photo-wrap"><img src="assets/{photo}" alt="" style="object-position: 50% {int(py * 100)}%" />{hl_html}</div></div>
        <div class="panel">
          <div class="step-row"><span id="{sid}-num" class="step-num">{k + 1}</span><span class="step-of">LANGKAH {k + 1}/{len(SLIDES)}</span></div>
          <span class="mask"><span id="{sid}-title" class="step-title">{title}</span></span>
          <div id="{sid}-body" class="step-body">{lines}</div>
        </div>
      </div>''')
    s0 = round(st, 2)
    slides_js.append(f'''      tl.fromTo("#{sid}-wrap", {{ scale: 1.14, opacity: 0.4 }}, {{ scale: 1.0, opacity: 1, duration: {du}, ease: "power1.out" }}, {s0});
      tl.fromTo("#{sid} .panel", {{ yPercent: 30, opacity: 0 }}, {{ yPercent: 0, opacity: 1, duration: 0.35, ease: "power3.out" }}, {s0});
      tl.fromTo("#{sid}-num", {{ scale: 0, rotation: -30 }}, {{ scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.4)" }}, {round(s0 + 0.3, 2)});
      tl.fromTo("#{sid}-title", {{ yPercent: 105 }}, {{ yPercent: 0, duration: 0.3, ease: "power4.out" }}, {round(s0 + 0.35, 2)});
      tl.fromTo("#{sid}-body .body-line", {{ opacity: 0, x: -24 }}, {{ opacity: 1, x: 0, duration: 0.25, ease: "power3.out", stagger: 0.12 }}, {round(s0 + 0.6, 2)});''')
    if hl:
        slides_js.append(f'''      tl.fromTo("#{sid}-hl", {{ opacity: 0, scale: 1.25 }}, {{ opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" }}, {round(s0 + 1.1, 2)});''')
LAST = SLIDES[-1]

html = f'''<!doctype html>
<html lang="ms">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>GoXpert Kad AR</title>
    <script src="vendor/gsap.min.js"></script>
    <style>{style}
      .slide {{ position: absolute; inset: 0; background: var(--ink); }}
      .photo {{ position: absolute; left: 0; top: 0; width: 1080px; height: 1250px; overflow: hidden; background: #000; }}
      .photo-wrap {{ position: absolute; inset: 0; transform-origin: 50% 50%; }}
      .photo-wrap img {{ position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }}
      .panel {{ position: absolute; left: 0; right: 0; top: 1210px; bottom: 0; padding: 56px 64px 0; background: var(--ink); border-top: 12px solid var(--accent); display: flex; flex-direction: column; gap: 22px; }}
      .step-row {{ display: flex; align-items: center; gap: 22px; }}
      .step-num {{ display: flex; align-items: center; justify-content: center; width: 120px; height: 120px; background: var(--accent); color: var(--ink); font-family: var(--display); font-size: 104px; line-height: 1; padding-top: 8px; }}
      .step-of {{ display: block; font-family: var(--mono); font-weight: 700; font-size: 32px; letter-spacing: 0.16em; color: var(--accent); }}
      .step-title {{ display: block; font-family: var(--display); font-size: 124px; line-height: 0.95; color: var(--paper); text-transform: uppercase; white-space: nowrap; }}
      .step-body {{ display: flex; flex-direction: column; gap: 8px; }}
      .body-line {{ display: block; font-family: var(--mono); font-weight: 700; font-size: 44px; line-height: 1.32; color: var(--paper); }}
      .hl-box {{ position: absolute; border: 8px dashed var(--accent); box-shadow: 0 0 0 4px rgba(29, 26, 51, 0.45); }}
      .hl-label {{ position: absolute; left: -8px; top: -62px; display: block; padding: 8px 16px 6px; background: var(--accent); color: var(--ink); font-family: var(--mono); font-weight: 700; font-size: 32px; white-space: nowrap; }}

      #hook {{ position: absolute; inset: 0; overflow: hidden; }}
      #hook-img {{ position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 45%; }}
      #hook-shade {{ position: absolute; inset: 0; background: linear-gradient(180deg, rgba(29, 26, 51, 0.92) 0%, rgba(29, 26, 51, 0.55) 45%, rgba(29, 26, 51, 0.2) 70%, rgba(29, 26, 51, 0.85) 100%); }}
      #hook-txt {{ position: absolute; left: 64px; right: 64px; top: 190px; display: flex; flex-direction: column; align-items: flex-start; gap: 18px; }}
      #hook-q {{ display: block; font-family: var(--display); font-size: 150px; line-height: 0.92; color: var(--paper); text-transform: uppercase; }}
      #hook-a {{ display: block; padding: 12px 26px 2px; background: var(--accent); color: var(--ink); font-family: var(--display); font-size: 116px; line-height: 0.95; text-transform: uppercase; }}

      #why {{ position: absolute; inset: 0; background: var(--ink); }}
      #why-img {{ position: absolute; left: 0; top: 0; width: 1080px; height: 900px; object-fit: cover; object-position: 50% 55%; opacity: 0.55; }}
      #why-fade {{ position: absolute; left: 0; top: 450px; width: 1080px; height: 450px; background: linear-gradient(180deg, rgba(29, 26, 51, 0) 0%, var(--ink) 100%); }}
      #why-content {{ position: absolute; left: 64px; right: 64px; top: 500px; display: flex; flex-direction: column; align-items: flex-start; gap: 44px; }}
      #why-title {{ display: block; padding: 12px 28px 2px; background: var(--accent); color: var(--ink); font-family: var(--display); font-size: 170px; line-height: 0.95; text-transform: uppercase; }}
      .why-item {{ display: flex; align-items: flex-start; gap: 24px; padding: 34px 34px 30px; background: rgba(246, 242, 231, 0.06); border-left: 10px solid var(--accent); width: 100%; }}
      .why-item .ico {{ font-size: 54px; color: var(--accent); margin-top: 4px; }}
      .why-text {{ display: block; font-family: var(--mono); font-weight: 700; font-size: 48px; line-height: 1.3; color: var(--paper); }}
      .why-text b {{ color: var(--accent); font-weight: 700; }}

      #proof-chip {{ position: absolute; left: 64px; right: 64px; top: 1790px; display: flex; justify-content: flex-start; }}
      #proof-chip .chip {{ font-size: 40px; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-width="1080" data-height="1920" data-duration="{TOTAL}">
      <div id="hook" class="clip" data-start="0" data-duration="{HOOK}" data-track-index="1">
        <img id="hook-img" src="assets/p13.jpg" alt="" />
        <div id="hook-shade"></div>
        <div id="hook-txt">
          <div id="hook-k" class="chip">TIPS PEMBELI RUMAH</div>
          <span class="mask"><span id="hook-q">Pemaju tak nak terima notis?</span></span>
          <span class="mask"><span id="hook-a">Hantar guna Pos Daftar + Kad AR</span></span>
        </div>
      </div>

      <div id="why" class="clip" data-start="{HOOK}" data-duration="{WHY}" data-track-index="1">
        <img id="why-img" src="assets/p01.jpg" alt="" />
        <div id="why-fade"></div>
        <div id="why-content">
          <span class="mask"><span id="why-title">Kenapa Kad AR?</span></span>
          <div id="why1" class="why-item">{WARN}<span class="why-text">Kadang <b>pemaju / management</b> tak nak terima notis secara fizikal.</span></div>
          <div id="why2" class="why-item">{CHECK}<span class="why-text">Kad AR = <b>bukti</b> notis dihantar &amp; diterima.</span></div>
          <div id="why3" class="why-item">{CHECK}<span class="why-text">S&amp;P pun sebut cara hantar dokumen: <b>Service of Document</b>.</span></div>
        </div>
      </div>

{chr(10).join(slides_html)}

      <div id="g-proof" class="clip" data-start="{round(LAST[0] + 2.2, 2)}" data-duration="{round(LAST[1] - 2.2, 2)}" data-track-index="3" style="position:absolute;inset:0">
        <div id="proof-chip"><div id="proof" class="chip solid">{CHECK} SIMPAN KAD AR SEBAGAI BUKTI</div></div>
      </div>

      <div id="progress" class="clip" data-start="0" data-duration="{END}" data-track-index="4"><span id="progress-fill"></span></div>

      <div id="endcard" class="clip" data-start="{END}" data-duration="3.5" data-track-index="5">
        <img id="end-bg" data-layout-allow-overflow src="assets/p13.jpg" alt="" />
        <div id="end-shade"></div>
        <div id="stripe"></div>
        <div id="end-content">
          <span id="end-kicker">TIPS PEMBELI · KAD AR</span>
          <span class="mask"><span id="end-1" class="end-line">Pemeriksaan</span></span>
          <span class="mask"><span id="end-2" class="end-line">Rumah</span></span>
          <span class="mask"><span id="end-3" class="end-line hl">Profesional</span></span>
          <div id="brand"><div id="brand-card"><img id="brand-logo" src="assets/logo.png" alt="GoXpert Solutions" /></div></div>
          <div id="cta"><span id="cta-label">WHATSAPP</span><span id="cta-num">011-3144 6591</span></div>
        </div>
      </div>
      <div id="flash-host" class="clip" data-start="0" data-duration="{TOTAL}" data-track-index="6"><div id="flash"></div></div>

{sfx}
    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      tl.fromTo("#progress-fill", {{ scaleX: 0 }}, {{ scaleX: 1, duration: {END}, ease: "none" }}, 0);

      tl.fromTo("#hook-img", {{ scale: 1.2 }}, {{ scale: 1.05, duration: {HOOK}, ease: "power1.out" }}, 0);
      tl.fromTo("#hook-k", {{ opacity: 0, x: -40 }}, {{ opacity: 1, x: 0, duration: 0.25, ease: "power3.out" }}, 0.05);
      tl.fromTo("#hook-q", {{ yPercent: 105 }}, {{ yPercent: 0, duration: 0.35, ease: "power4.out" }}, 0.3);
      tl.fromTo("#hook-a", {{ yPercent: 105 }}, {{ yPercent: 0, duration: 0.35, ease: "power4.out" }}, 1.55);

      tl.fromTo("#why-img", {{ scale: 1.15 }}, {{ scale: 1, duration: {WHY}, ease: "power1.out" }}, {HOOK});
      tl.fromTo("#why-title", {{ yPercent: 105 }}, {{ yPercent: 0, duration: 0.35, ease: "power4.out" }}, {HOOK + 0.1});
      tl.fromTo("#why1", {{ opacity: 0, x: -50 }}, {{ opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }}, {HOOK + 1.0});
      tl.fromTo("#why2", {{ opacity: 0, x: -50 }}, {{ opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }}, {HOOK + 2.0});
      tl.fromTo("#why3", {{ opacity: 0, x: -50 }}, {{ opacity: 1, x: 0, duration: 0.3, ease: "power3.out" }}, {HOOK + 3.0});

{chr(10).join(slides_js)}
      tl.fromTo("#proof", {{ opacity: 0, scale: 0.6 }}, {{ opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2.2)", transformOrigin: "0% 50%" }}, {round(LAST[0] + 2.2, 2)});

      tl.fromTo("#flash", {{ opacity: 0 }}, {{ opacity: 0.9, duration: 0.05, ease: "none" }}, {round(END - 0.05, 2)});
      tl.to("#flash", {{ opacity: 0, duration: 0.3, ease: "power2.out" }}, {END});
      tl.fromTo("#end-bg", {{ filter: "blur(0px)", scale: 1.1 }}, {{ filter: "blur(18px)", scale: 1, duration: 0.8, ease: "power2.out" }}, {END});
      tl.fromTo("#end-shade", {{ opacity: 0 }}, {{ opacity: 1, duration: 0.45, ease: "power2.out" }}, {END});
      tl.fromTo("#stripe", {{ scaleY: 0 }}, {{ scaleY: 1, duration: 0.6, ease: "power3.out" }}, {round(END + 0.1, 2)});
      tl.fromTo("#end-kicker", {{ opacity: 0, x: -40 }}, {{ opacity: 1, x: 0, duration: 0.35, ease: "power3.out" }}, {round(END + 0.15, 2)});
      tl.fromTo(["#end-1", "#end-2", "#end-3"], {{ yPercent: 105 }}, {{ yPercent: 0, duration: 0.5, ease: "power4.out", stagger: 0.1 }}, {round(END + 0.3, 2)});
      tl.fromTo("#brand-card", {{ opacity: 0, scale: 0.6 }}, {{ opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }}, {round(END + 1.5, 2)});
      tl.fromTo("#cta", {{ opacity: 0, y: 40 }}, {{ opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.8)" }}, {round(END + 2.2, 2)});
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
'''
open("index.html", "w").write(html)
print("END", END, "TOTAL", TOTAL)
print("hold frames:", [round(s[0] + 3.0, 2) for s in SLIDES])
