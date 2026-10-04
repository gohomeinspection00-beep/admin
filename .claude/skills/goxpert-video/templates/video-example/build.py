# Generates index.html: cut list, captions, graphics, SFX.
import json

# Part 1 (talk.mp4, sharper 1080p take): (output start, duration, source start, zoom)
CUTS1 = [
    (0.00, 2.97, 4.38, 1.00),
    (2.97, 6.72, 8.28, 1.00),
    (9.69, 2.50, 15.50, 1.00),
    (12.19, 6.46, 23.92, 1.12),
    (18.65, 5.55, 30.55, 1.08),
    (24.20, 2.24, 38.16, 1.00),
    (26.44, 1.70, 40.62, 1.10),
    (28.14, 3.36, 45.24, 1.00),
]
# Part 2 (talk2.mp4, the 2-minute take): (source in, source out, zoom)
SRC2 = [
    (48.76, 60.92, 1.00),
    (61.00, 65.62, 1.10),
    (67.42, 74.10, 1.00),
    (75.61, 78.98, 1.10),
    (80.46, 85.22, 1.00),
    (85.60, 91.62, 1.12),
    (92.75, 104.84, 1.00),
    (105.40, 118.82, 1.10),
]
CUTS2 = []
t = 31.50
for a, b, z in SRC2:
    CUTS2.append((round(t, 2), round(b - a, 2), a, z))
    t += b - a
END = round(t, 2)
TOTAL = round(END + 3.5, 2)

def o2(src):
    """Map a part-2 source time to output time."""
    for (s, d, m, z) in CUTS2:
        if m - 0.05 <= src <= m + d + 0.05:
            return round(s + (min(max(src, m), m + d) - m), 2)
    raise ValueError(src)

# Part 2 captions in SOURCE time (mapped with o2)
CAPS2_SRC = [
    (48.76, 50.0, "tapi dalam kes ni"),
    (50.0, 51.05, "hari tu kita ada report"),
    (51.05, 52.4, "<b>air bertakung</b>"),
    (52.4, 53.6, "tapi bagusnya"),
    (53.6, 55.4, "dia orang buat"),
    (55.4, 56.6, "sapukan balik <b>waterproof</b>"),
    (56.6, 57.73, "tapi"),
    (57.73, 59.2, "tak buat <b>surface preparation</b>"),
    (59.2, 60.92, "untuk levelling balik"),
    (61.0, 62.4, "okay dekat sini"),
    (62.4, 63.6, "air <b>masih bertakung</b>"),
    (63.6, 64.6, "kali ketiga kita report"),
    (64.6, 65.62, "pun <b>air bertakung</b>"),
    (67.42, 69.35, "dan ada beberapa"),
    (69.35, 71.0, "atap genting"),
    (71.0, 72.4, "yang memang <b>dah pecah</b>"),
    (72.4, 74.1, "ni <b>kali ketiga</b> kita report"),
    (75.61, 76.9, "dan kali ketiga juga"),
    (76.9, 78.0, "diorang <b>tak repair</b>"),
    (78.0, 78.98, "so boleh tengok"),
    (80.46, 81.7, "tapi macam tu lah saya cakap"),
    (81.7, 82.6, "kadang-kadang"),
    (82.6, 83.93, "bila kita buat inspection"),
    (83.93, 85.22, "kita nak <b>kepastian</b>"),
    (85.6, 86.78, "kita nak ada satu"),
    (86.78, 88.43, "<b>jaminan</b>"),
    (88.43, 89.9, "adakah defect rumah kita"),
    (89.9, 91.62, "<b>dibaiki</b>?"),
    (92.75, 93.7, "dalam kes ni"),
    (93.7, 95.25, "kita dah datang <b>kali ketiga</b>"),
    (95.25, 96.4, "pun masih ada lagi"),
    (96.4, 97.6, "so <b>solution</b> dia apa?"),
    (97.6, 98.9, "kita akan hantar <b>surat</b>"),
    (98.9, 100.4, "<b>notis</b> semua tu"),
    (100.4, 101.6, "untuk selesaikan"),
    (101.6, 103.0, "berserta <b>sebut harga</b>"),
    (103.0, 104.84, "daripada <b>kontraktor berdaftar</b>"),
    (105.4, 106.9, "jadi daripada"),
    (106.9, 108.28, "<b>dokumen-dokumen</b> tu semua"),
    (108.28, 110.5, "kita bawa masuk ke <b>tribunal</b>"),
    (110.5, 112.2, "itu jalan penyelesaian"),
    (112.2, 113.65, "<b>terakhir</b> sekiranya tak dapat"),
    (113.65, 115.58, "selesaikan semua masalah"),
    (115.58, 117.0, "berkaitan dengan defect"),
    (117.0, 118.82, "itu <b>hak anda</b> sebenarnya"),
]

# (start, end, html) — keywords wrapped in <b>
CAPS = [
    (0.02, 0.85, "Sebenarnya rumah ni"),
    (0.85, 1.47, "<b>kali ketiga</b>"),
    (1.47, 2.97, "kita datang buat inspection"),
    (2.97, 3.59, "Hari ni adalah"),
    (3.59, 4.44, "<b>final stage</b>"),
    (4.44, 5.95, "untuk kita submit"),
    (5.95, 6.99, "kepada pihak <b>developer</b>"),
    (6.99, 7.89, "dan bagi chance"),
    (7.89, 8.69, "kepada <b>developer</b>"),
    (8.69, 9.69, "untuk <b>selesaikan semua</b>"),
    (9.69, 10.59, "masalah rumah ni"),
    (10.59, 11.49, "yang kita pernah <b>report</b>"),
    (11.49, 12.19, "before this"),
    (12.19, 13.47, "masih ada lagi <b>defect</b>"),
    (13.47, 14.40, "tapi kita cakap"),
    (14.40, 15.25, "benda yang <b>baik</b>"),
    (15.25, 15.97, "dan yang <b>tak baik</b>"),
    (16.07, 17.20, "salah satunya"),
    (17.20, 18.62, "saya tunjukkan"),
    (18.65, 19.42, "before this punya"),
    (19.42, 20.55, "untuk <b>kali pertama</b>"),
    (20.55, 21.70, "kita pernah buat inspection"),
    (21.70, 22.90, "dan kita pernah <b>report</b>"),
    (22.90, 24.20, "dekat bahagian sini"),
    (24.20, 25.30, "dekat sini ada <b>lubang</b>"),
    (25.30, 26.44, "tapi dia dah <b>tampal</b>"),
    (26.44, 27.20, "dekat sini pun"),
    (27.20, 28.14, "ada <b>lubang</b> tu"),
    (28.14, 29.35, "diorang pun dah"),
    (29.35, 30.20, "<b>tampal semua</b>"),
    (30.20, 31.50, "so kiranya dah <b>okey</b> lah"),
]
CAPS += [(o2(a), o2(b), t) for a, b, t in CAPS2_SRC]

# (id, src, start, dur, volume, media_start)
SFX = [
    ("s-open", "sfx_001", 0.00, 0.6, 0.35, 0),
    ("s-tick1", "sfx_005", 0.30, 0.7, 0.30, 0),
    ("s-tick2", "sfx_005", 0.55, 0.7, 0.30, 0),
    ("s-three", "sfx_002", 0.88, 2.0, 0.40, 0),
    ("s-final", "sfx_002", 3.58, 2.0, 0.45, 0),
    ("s-flow1", "sfx_003", 4.50, 1.3, 0.28, 0),
    ("s-flow2", "sfx_003", 6.00, 1.3, 0.28, 0),
    ("s-flow3", "sfx_003", 8.70, 1.3, 0.28, 0),
    ("s-report", "sfx_008", 10.62, 0.4, 0.6, 0),
    ("s-defect", "sfx_007", 12.22, 1.0, 0.22, 0),
    ("s-good", "sfx_005", 14.42, 0.7, 0.32, 0),
    ("s-bad", "sfx_005", 15.27, 0.7, 0.32, 0),
    ("s-jom", "sfx_001", 16.95, 0.6, 0.40, 0),
    ("s-first", "sfx_008", 19.45, 0.4, 0.6, 0),
    ("s-stamp", "sfx_002", 22.55, 2.0, 0.45, 0),
    ("s-hole1", "sfx_003", 24.30, 1.3, 0.28, 0),
    ("s-fix1", "sfx_004", 25.35, 1.0, 0.30, 0),
    ("s-hole2", "sfx_003", 26.50, 1.3, 0.28, 0),
    ("s-fix2", "sfx_004", 27.25, 0.9, 0.30, 0),
    ("s-ok", "sfx_006", 29.35, 2.1, 0.40, 0),
    ("s-tribunal-hook", "sfx_010", 1.62, 2.0, 0.40, 0),
]
SFX2_SRC = [
    ("s-pond", "sfx_003", 51.1, 1.3, 0.28),
    ("s-wp", "sfx_005", 55.45, 0.7, 0.32),
    ("s-prep", "sfx_007", 57.8, 1.0, 0.18),
    ("s-still", "sfx_002", 62.45, 2.0, 0.40),
    ("s-r3a", "sfx_008", 63.65, 0.4, 0.55),
    ("s-tile", "sfx_002", 71.05, 2.0, 0.40),
    ("s-r3b", "sfx_008", 72.45, 0.4, 0.55),
    ("s-norepair", "sfx_010", 76.95, 2.0, 0.45),
    ("s-quote", "sfx_001", 83.9, 0.6, 0.35),
    ("s-jaminan", "sfx_003", 86.85, 1.3, 0.28),
    ("s-k3", "sfx_008", 93.75, 0.4, 0.55),
    ("s-solution", "sfx_001", 96.35, 0.6, 0.40),
    ("s-step1", "sfx_005", 97.65, 0.7, 0.35),
    ("s-step2", "sfx_005", 101.65, 0.7, 0.35),
    ("s-step3", "sfx_002", 108.35, 2.0, 0.50),
    ("s-last", "sfx_003", 110.55, 1.3, 0.28),
    ("s-hak", "sfx_006", 117.05, 2.1, 0.40),
]
SFX2_SRC += [
    ("s-pb2-in", "sfx_001", 51.25, 0.6, 0.40),
    ("s-pb2-snap", "sfx_008", 51.4, 0.4, 0.70),
    ("s-pb3-in", "sfx_001", 77.95, 0.6, 0.40),
    ("s-pb3-snap", "sfx_008", 78.1, 0.4, 0.70),
]
SFX += [(i, f, o2(st), d, v, 0) for i, f, st, d, v in SFX2_SRC]
SFX += [("s-pb1-in", "sfx_001", 24.95, 0.6, 0.40, 0), ("s-pb1-snap", "sfx_008", 25.08, 0.4, 0.70, 0)]
SFX += [
    ("s-riser", "sfx_009", round(END - 1.2, 2), 1.20, 0.30, 8.83),
    ("s-out", "sfx_001", round(END - 0.2, 2), 0.6, 0.45, 0),
    ("s-end", "sfx_002", round(END + 0.35, 2), 2.0, 0.50, 0),
    ("s-logo", "sfx_004", round(END + 1.5, 2), 1.8, 0.35, 0),
    ("s-cta", "sfx_005", round(END + 2.2, 2), 0.7, 0.35, 0),
]

def fade_lane(d, f=0.04):
    return json.dumps({"version": 1, "lanes": [{"target": "volume", "points": [
        {"t": 0, "v": 0}, {"t": f, "v": 1}, {"t": round(d - f, 3), "v": 1}, {"t": d, "v": 0}]}]})

CUTS = CUTS1 + CUTS2
videos = "\n".join(
    f'''        <video id="v{i+1}" class="clip footage" src="assets/{'talk.mp4' if i < len(CUTS1) else 'talk2.mp4'}" playsinline data-has-audio="true"
          data-start="{s}" data-duration="{d}" data-media-start="{m}" data-track-index="0"
          data-automation='{fade_lane(d)}'></video>'''
    for i, (s, d, m, z) in enumerate(CUTS))

caps = "\n".join(
    f'''      <div id="cap{i}" class="cap clip" data-start="{s}" data-duration="{round(e - s, 2)}" data-track-index="1"><span class="cap-in">{t}</span></div>'''
    for i, (s, e, t) in enumerate(CAPS))

sfx = "\n".join(
    f'''      <audio id="{i}" src=".media/audio/sfx/{f}.mp3" data-start="{s}" data-duration="{d}" data-volume="{v}"''' +
    (f''' data-media-start="{m}"''' if m else "") + f''' data-track-index="{20 + k}"></audio>'''
    for k, (i, f, s, d, v, m) in enumerate(SFX))

zoom_js = "\n".join(
    f'      tl.set("#cam, #cam-fg", {{ scale: {z} }}, {s});' for (s, d, m, z) in CUTS)

# Background-removed subject overlays: (webm, webm source-zero in talk2 time, [(src_in, src_out), ...])
FG = [("assets/fg-quote.webm", 80.36, [(83.85, 85.22), (85.60, 91.62)])]
fg_items = []
for k, (src, zero, ranges) in enumerate(FG):
    for j, (a, b) in enumerate(ranges):
        fg_items.append(
            f'''        <video id="fg{k}-{j}" class="clip footage" src="{src}" muted playsinline
          data-start="{o2(a)}" data-duration="{round(o2(b) - o2(a), 2)}" data-media-start="{round(a - zero, 2)}" data-track-index="7"></video>''')
fg_videos = "\n".join(fg_items)

cap_js = "\n".join(
    f'      tl.fromTo("#cap{i} .cap-in", {{ y: 26, scale: 0.92, opacity: 0 }}, {{ y: 0, scale: 1, opacity: 1, duration: 0.18, ease: "back.out(2)" }}, {s});'
    for i, (s, e, t) in enumerate(CAPS))

CHECK = '<svg viewBox="0 0 24 24" class="ico"><path d="M4 12.5l5 5L20 6.5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="square"/></svg>'
CROSS = '<svg viewBox="0 0 24 24" class="ico"><path d="M5 5l14 14M19 5L5 19" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="square"/></svg>'
WARN = '<svg viewBox="0 0 24 24" class="ico"><path d="M12 2.5L23 21.5H1z" fill="currentColor"/><path d="M12 9v6M12 17.2v1.6" stroke="#1d1a33" stroke-width="2.6"/></svg>'
ARROW = '<svg viewBox="0 0 24 24" class="ico"><path d="M3 12h16M13 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="square"/></svg>'

T2 = {
    "PONDS": o2(48.76), "PONDD": round(o2(60.92) - o2(48.76), 2),
    "POND1": o2(51.05), "POND2": o2(55.45), "POND3": o2(57.8),
    "STILLS": o2(61.0), "STILLD": round(o2(65.62) - o2(61.0), 2), "STILL1": o2(62.45), "STILL2": o2(63.65),
    "TILES": o2(67.42), "TILED": round(o2(74.1) - o2(67.42), 2), "TILE1": o2(71.05), "TILE2": o2(72.45),
    "NORS": o2(75.61), "NORD": round(o2(78.98) - o2(75.61), 2), "NOR1": o2(76.9),
    "QS": o2(80.46), "QD": round(o2(91.62) - o2(80.46), 2), "Q1": o2(83.93), "Q2": o2(86.8), "Q3": o2(89.9),
    "STS": o2(92.75), "STD": round(o2(118.82) - o2(92.75), 2), "ST0": o2(93.75), "ST1": o2(96.4),
    "ST2": o2(97.65), "ST3": o2(101.65), "ST4": o2(108.35), "ST5": o2(110.55), "ST6": o2(117.05),
    "ENDP1": round(END + 0.1, 2), "ENDP2": round(END + 0.15, 2), "ENDP3": round(END + 0.3, 2),
    "ENDP4": round(END + 1.5, 2), "ENDP5": round(END + 2.2, 2), "ENDP6": round(END + 2.65, 2),
    "FLASH1": round(END - 0.05, 2),
    "PB2S": o2(51.3), "PB2D": round(o2(55.3) - o2(51.3), 2),
    "PB3S": o2(78.0), "PB3D": round(o2(82.73) - o2(78.0), 2),
}
for (s_, d_, m_, z_) in CUTS2:
    pass
html = open(".build/template.tpl").read()
for k, v in T2.items():
    html = html.replace(f"__T_{k}__", str(v))
for k, v in {"__FGVIDEOS__": fg_videos, "__VIDEOS__": videos, "__CAPS__": caps, "__SFX__": sfx, "__ZOOM__": zoom_js,
             "__CAPJS__": cap_js, "__CHECK__": CHECK, "__CROSS__": CROSS, "__WARN__": WARN,
             "__ARROW__": ARROW, "__END__": str(END), "__ENDDUR__": str(round(TOTAL - END, 2)),
             "__TOTAL__": str(TOTAL)}.items():
    html = html.replace(k, v)
open("index.html", "w").write(html)
print("ok")
