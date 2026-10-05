# "Defects Apa Harini?" series — generates index.html from episode.json.
# usage (inside the project dir): python3 build.py [episode.json] [template.tpl]
import json, sys, os

HERE = os.path.dirname(os.path.abspath(__file__))
ep = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "episode.json"))
tpl = open(sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, "template.tpl")).read()

INTRO = ep.get("intro", 2.4)
END_DUR = 3.5

# Clips play back to back from t=0 (the ident sits on top of the first clip).
clips, t = [], 0.0
for c in ep["clips"]:
    rate = c.get("rate", 1)
    d = round((c["out"] - c["in"]) / rate, 2)
    clips.append({**c, "start": round(t, 2), "dur": d, "rate": rate})
    t += d
END = round(t, 2)
TOTAL = round(END + END_DUR, 2)

def fade_lane(d, v=1.0, f=0.04):
    return json.dumps({"version": 1, "lanes": [{"target": "volume", "points": [
        {"t": 0, "v": 0}, {"t": f, "v": v}, {"t": round(d - f, 3), "v": v}, {"t": d, "v": 0}]}]})

videos = "\n".join(
    f'''        <video id="v{i}" class="clip footage" src="{c['src']}" playsinline''' +
    (f''' data-has-audio="true" data-automation='{fade_lane(c['dur'], c.get('volume', 1.0))}' ''' if c.get("audio", True) else " muted ") +
    (f''' data-playback-rate="{c['rate']}"''' if c["rate"] != 1 else "") +
    f''' data-start="{c['start']}" data-duration="{c['dur']}" data-media-start="{c['in']}" data-track-index="0"></video>'''
    for i, c in enumerate(clips))

CHECK = '<svg viewBox="0 0 24 24" class="ico"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="square"/></svg>'
WARN = '<svg viewBox="0 0 24 24" class="ico"><path d="M12 2.5L23 21.5H1z" fill="currentColor"/><path d="M12 9v6M12 17.2v1.6" stroke="#1d1a33" stroke-width="2.6"/></svg>'
ARROW = '<svg viewBox="0 0 24 24" class="ico"><path d="M3 12h16M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="square"/></svg>'
PIN = '<svg viewBox="0 0 24 24" class="ico"><path d="M12 1.5a7.5 7.5 0 0 0-7.5 7.5c0 5.6 7.5 13.5 7.5 13.5s7.5-7.9 7.5-13.5A7.5 7.5 0 0 0 12 1.5z" fill="currentColor"/><circle cx="12" cy="9" r="2.8" fill="#1d1a33"/></svg>'

D, R, S, L = ep["defect"], ep["risks"], ep["stamp"], ep["level"]

# Marks: dashed ring + label at a footage position (1080x1920 space, measured from frames).
marks, mark_js = [], []
for i, m in enumerate(ep.get("marks", [])):
    marks.append(
        f'''        <div id="mk{i}" class="mark {m.get('side', 'right')} clip" data-start="{m['at']}" data-duration="{m['dur']}" data-track-index="1" style="left:{m['x']}px;top:{m['y']}px">
          <span class="ring"></span><div class="mark-tag chip solid">{m['label']}</div>
        </div>''')
    a = m["at"]
    mark_js += [
        f'      tl.fromTo("#mk{i} .ring", {{ scale: 1.8, opacity: 0 }}, {{ scale: 1, opacity: 1, duration: 0.3, ease: "power3.out" }}, {a + 0.02});',
        f'      tl.fromTo("#mk{i} .ring", {{ rotation: 0 }}, {{ rotation: 120, duration: {m["dur"]}, ease: "none", immediateRender: false }}, {a});',
        f'      tl.fromTo("#mk{i} .mark-tag", {{ opacity: 0, y: 20 }}, {{ opacity: 1, y: 0, duration: 0.25, ease: "back.out(2)" }}, {a + 0.15});',
        f'      tl.to("#mk{i}", {{ opacity: 0, duration: 0.18 }}, {round(a + m["dur"] - 0.18, 2)});',
    ]

zoom_js = []
for z in ep.get("zooms", []):
    o = f'{z["x"]}px {z["y"]}px'
    zoom_js.append(f'      tl.fromTo("#cam, #marks", {{ scale: 1, transformOrigin: "{o}" }}, {{ scale: {z["scale"]}, duration: {z.get("ease_in", 0.5)}, ease: "power3.out", immediateRender: false }}, {z["at"]});')
    zoom_js.append(f'      tl.to("#cam, #marks", {{ scale: 1, duration: 0.3, ease: "power2.inOut" }}, {round(z["at"] + z["dur"] - 0.3, 2)});')

bars = "\n".join(
    f'            <span class="lv{" on" if k < L["value"] else ""}" style="height:{50 + 30 * k}px"></span>' for k in range(3))
risks = "\n".join(
    f'          <div id="rk{k}" class="step"><span class="num">{k + 1}</span>{txt}</div>' for k, txt in enumerate(R["items"]))
risk_js = "\n".join(
    f'      tl.fromTo("#rk{k}", {{ opacity: 0, x: -50 }}, {{ opacity: 1, x: 0, duration: 0.28, ease: "back.out(1.8)" }}, {round(R["at"] + 0.5 + k * R.get("gap", 0.55), 2)});'
    for k in range(len(R["items"])))

CAPS = ep.get("captions", [])
caps = "\n".join(
    f'      <div id="cap{i}" class="cap clip" data-start="{s}" data-duration="{round(e - s, 2)}" data-track-index="1"><span class="cap-in">{t}</span></div>'
    for i, (s, e, t) in enumerate(CAPS))
cap_js = "\n".join(
    f'      tl.fromTo("#cap{i} .cap-in", {{ y: 26, scale: 0.92, opacity: 0 }}, {{ y: 0, scale: 1, opacity: 1, duration: 0.18, ease: "back.out(2)" }}, {s});'
    for i, (s, e, t) in enumerate(CAPS))

# SFX by name (assets/sfx/<name>.mp3). Riser peaks ~3.3 s in: start it 3.4 s before the end card.
SFX = [
    ("whoosh", 0.0, 0.57, 0.35), ("pop", 0.1, 0.7, 0.3), ("impact", 0.45, 2.1, 0.4), ("ping", 0.82, 1.3, 0.28),
    ("whoosh", INTRO - 0.15, 0.57, 0.4),
    ("impact", D["at"] + 0.12, 2.1, 0.4), ("pop", D["at"] + 0.5, 0.7, 0.3),
]
SFX += [("ping", m["at"] + 0.02, 1.3, 0.28) for m in ep.get("marks", [])]
SFX += [("whoosh", z["at"], 0.57, 0.3) for z in ep.get("zooms", [])]
SFX += [("error", R["at"] + 0.1, 1.0, 0.2)]
SFX += [("click", round(R["at"] + 0.2 + k * 0.14, 2), 0.36, 0.5) for k in range(3)]
SFX += [("pop", round(R["at"] + 0.5 + k * R.get("gap", 0.55), 2), 0.7, 0.3) for k in range(len(R["items"]))]
SFX += [("impact", S["at"] + 0.2, 2.1, 0.45), ("pop", S["at"] + 0.6, 0.7, 0.3)]
SFX += [("riser", round(END - 3.4, 2), 3.6, 0.3), ("whoosh", END - 0.2, 0.57, 0.45),
        ("impact", END + 0.35, 2.1, 0.5), ("sparkle", END + 1.3, 1.8, 0.35), ("pop", END + 1.9, 0.7, 0.35)]
sfx = "\n".join(
    f'      <audio id="sx{k}" src="assets/sfx/{n}.mp3" data-start="{round(s, 2)}" data-duration="{d}" data-volume="{v}" data-track-index="{20 + k}"></audio>'
    for k, (n, s, d, v) in enumerate(SFX))

EPS = f'{ep["ep"]:02d}'
rep = {
    "__VIDEOS__": videos, "__MARKS__": "\n".join(marks), "__MARKJS__": "\n".join(mark_js),
    "__ZOOMJS__": "\n".join(zoom_js), "__LEVELBARS__": bars, "__RISKS__": risks, "__RISKJS__": risk_js,
    "__CAPS__": caps, "__CAPJS__": cap_js, "__SFX__": sfx,
    "__D_TITLE__": D["title"], "__D_PLACE__": D["place"], "__D_AT__": str(D["at"]), "__D_DUR__": str(D["dur"]),
    "__R_HEAD__": R.get("head", "RISIKO"), "__R_AT__": str(R["at"]), "__R_DUR__": str(R["dur"]),
    "__L_LABEL__": L["label"],
    "__S_TEXT__": S["text"], "__S_TIP__": S["tip"], "__S_AT__": str(S["at"]), "__S_DUR__": str(round(END - S["at"], 2)),
    "__EP__": EPS, "__DATE__": ep.get("date", ""), "__KICKER__": ep.get("kicker", "SIRI INSPECTION RUMAH · GOXPERT"),
    "__NEXT__": ep.get("next", "FOLLOW · EP SETERUSNYA"),
    "__INTRO__": str(INTRO), "__BADGEDUR__": str(round(END - INTRO, 2)),
    "__END__": str(END), "__ENDDUR__": str(END_DUR), "__TOTAL__": str(TOTAL),
    "__WARN__": WARN, "__CHECK__": CHECK, "__ARROW__": ARROW, "__PIN__": PIN,
}
for k in sorted(rep, key=len, reverse=True):
    tpl = tpl.replace(k, rep[k])
open("index.html", "w").write(tpl)
print(f"ok  EP {EPS}  footage {END}s  total {TOTAL}s")
