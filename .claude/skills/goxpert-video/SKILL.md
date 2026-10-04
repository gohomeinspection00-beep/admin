---
name: goxpert-video
description: GoXpert Solutions (Go Home Inspection) house style for editing inspection videos with HyperFrames — the client-approved colours, captions, motion graphics, SFX, audio clean-up, subject cut-out, end card and thumbnail. Use whenever the user sends a video/footage to edit, asks for a reel/TikTok/inspection video, adds before photos, or asks for a thumbnail. Also defines the mandatory plan → materials → build → review → thumbnail conversation flow.
---

# GoXpert inspection video — house style + workflow

The client (Malay-speaking, writes casual Malay) approved this exact look on 2026-10-04
("Inspection kali ke-3 sebelum ke Tribunal", 1:38, 9:16). Keep colours, fonts, components,
SFX map, audio chain and end card identical for every new video unless the client asks
otherwise. Talk to the client in casual Malay.

Run `bash scripts/setup.sh` once per session (installs HyperFrames skills, sherpa-onnx,
Whisper large-v3-turbo + Silero VAD from GitHub — huggingface.co is blocked here).
Then follow `/hyperframes` → `/general-video` + `/hyperframes-core` for the composition contract.

## 1. Mandatory conversation flow (client rule)

1. **Receive video → analyse first, do not edit yet.** Probe (duration, resolution, rotation,
   HDR), make a contact sheet, extract `-ac 1 -ar 16000` audio, run `scripts/transcribe.py`.
2. **Tell the plan, then ask for materials — wait for the answer.** First question, always:
   **"Video ni nak pos kat mana?"** (TikTok / IG Reels / FB Reels / YouTube Shorts / FB feed /
   YouTube biasa). The answer sets the format: Reels/TikTok/Shorts → 9:16 1080×1920, captions
   above `bottom: 440px`, ≤ 90 s ideal; FB/IG feed → 4:5 1080×1350 (keep text inside it);
   YouTube biasa → 16:9 1920×1080 + a 1280×720 thumbnail. Several platforms → one master
   9:16 plus extra exports. Then, in Malay, send:
   - transcript summary + what will be cut (false starts, repeated phrases, fillers, pauses),
     estimated final length;
   - the beat-by-beat graphics plan (which component at which line), SFX, end card;
   - **what you need from them**, e.g. a "before" photo for every defect he mentions (list each
     with timestamp), any hook/headline message (e.g. "kali ke-3 sebelum ke tribunal"),
     extra clips, change of phone/CTA, whether a longer/full take exists.
3. **Build** (sections 2–4), verify with `hyperframes check` + snapshots, render, `scripts/share.sh`, send.
4. **After every delivered draft ask:** "Nak tukar apa-apa lagi, atau dah siap?"
5. **When they say siap → make the thumbnail** (section 5), send it, ask if it's OK.
6. **Always suggest improvements (client rule).** In the plan (step 2) and with each draft,
   add a short "Cadangan penambahbaikan" list: anything you think would make the video better
   (e.g. a music bed, a hook in the first 2 s, stronger before/after split, extra B-roll, better
   take, safer layout). Suggest only — never add it without the client's yes. Record accepted
   ideas in this skill so they become the new default.

## 2. Brand + design tokens (never change without being asked)

| Token | Value |
|---|---|
| `--ink` | `#1d1a33` (indigo from the team shirt) — boxes, end-card shade |
| `--paper` | `#f6f2e7` — text |
| `--accent` | `#f6c33b` (safety yellow from the shirt print) — keywords, titles, bars |
| Display font | `League Gothic` (400 only), UPPERCASE |
| Label font | `JetBrains Mono` 700 |
| Logo | `assets/logo.png` (GoXpert Solutions, black text → always on a white rounded card, radius 18–22px). Source: branch `claude/company-website-lnp12i`, `website/img/logo.png` |
| CTA | `WHATSAPP 011-3144 6591` on a yellow bar |
| Canvas | 1080×1920, 30fps, render `--sdr` |

Copy `assets/gsap.min.js` to the project `vendor/` and load it locally (the CDN is blocked at render time).

## 3. Components (reference implementation: `templates/video-example/`)

`template.tpl` + `build.py` are the full approved composition — copy and adapt; `build.py`
holds the cut list (`CUTS1`/`SRC2` + `o2()` source→output mapping), captions, SFX table and the
background-removed overlay list (`FG`). Keep the template outside the project root (e.g. `.build/`)
or `check` errors with `multiple_root_compositions`.

- **Jump cuts**: each kept range = its own `<video>` clip (`data-media-start`), 40 ms volume fade
  lane in/out (`data-automation`). Alternate zoom per cut on the untimed `#cam` wrapper
  (1.00 / 1.08–1.14, `transform-origin: 50% 30%`) + short punch-ins on key words.
- **Captions**: phrase chunks ≤ ~1.5 s, League Gothic 96px uppercase in an ink box (0.92),
  keywords in yellow via `<b>`, `bottom: 440px`, pop-in `back.out(2)` 0.18 s.
- **Progress bar**: 12px yellow at the top, scaleX 0→1 over the talking part.
- **Chips**: mono 38px; ink + 4px yellow border, or solid yellow. Icons are inline SVG (✓ ✗ ⚠ →), never emoji.
- **Big title**: League Gothic 150–170px on a yellow block, slides up from a mask + bass impact.
- **Counter**: boxes 1 ✓ 2 ✓ **3** + "KALI KE-N" (+ hook chip such as "SEBELUM KE TRIBUNAL").
- **Flow / steps**: chips with arrows (LAPORAN → DEVELOPER → BAIKI) or numbered yellow squares
  ① ② ③, positioned low (`bottom: 590px`) so they never cover the face.
- **Stamp**: League Gothic 140–150px, thick border, rotated −7/−8°, slams scale 2.4→1
  (`power4.in`) + impact. Place it where it doesn't cover the face.
- **Before photo card**: white polaroid (18px border, shadow), rotation ±3°, yellow label
  "BEFORE · <DEFECT>", slow zoom 1→1.08, whoosh + shutter click. Show it exactly when he
  mentions that defect. If the footage shows the repaired spot, **first show the location**
  (dashed yellow ring tracking his fingertip — measure positions from frames — with
  "LOKASI DIBAIKI"), **then** the before photo as a smaller card that leaves the spot visible.
- **Quote card**: ink 0.92 box with 10px yellow top border, yellow “ mark, 104px lines,
  keyword in yellow.
- **Subject in front of big graphics** (client favourite): where a big box/title clashes with
  his head, cut him out with `npx hyperframes remove-background clip.mp4 -o fg.webm --quality best`
  (u2net, ~0.4 s/frame on CPU — only for the clashing ranges), add the webm **muted** in an
  untimed `#cam-fg` wrapper above graphics/below captions, same `data-start/data-media-start`
  and the same zoom tweens as `#cam` (`"#cam, #cam-fg"`). Audio must not double.
- **End card (3.5 s)**: last frame blurred 18px + ink shade 0.82, yellow vertical stripe,
  mono kicker (e.g. "INSPECTION KE-3 · SEBELUM KE TRIBUNAL"), "PEMERIKSAAN / RUMAH /
  **PROFESIONAL**" (200px, last line yellow), logo card, WhatsApp CTA; white flash in.

## 4. Sound + audio

**SFX map** (bundled library via `npx hyperframes media-use resolve --type sfx`):
whoosh-short (entries/transitions), impact-bass (titles, stamps, end), ping (tags), pop (chips,
ticks), click-soft (shutter/"report"), sparkle (✓ fixed), chime (all good / "hak anda"),
error (warnings, ≤0.22), riser (last 1.2 s into the end card). Volumes 0.25–0.5; speech dominates.
**Never use the glitch SFX** — the client heard it as crackling ("bunyi pecah").

**Speech**: always run `scripts/clean_audio.sh` on every source before building
(RNNoise `assets/sh.rnnn` + light FFT denoise + fast gate + compressor + loudnorm −13).
The client asked for louder speech and less noise — this is the approved balance; harsher
settings ate consonants. Re-transcribe a few kept ranges after cleaning to confirm.
Final deliverable: `scripts/share.sh render.mp4 share.mp4` (−13 LUFS, ~21 MB per 100 s).

## 4b. Hook — first 2–2.5 s (added for the Tribunal video, keep doing it)

Before the talking part, pre-roll a hook built from his own strongest line about the main
defect (e.g. "dan kali ketiga juga, diorang tak repair"), cut with the before photos
(full photo on a blurred copy so red boxes stay visible → tight crop of the close-up) →
his footage with the "✗ TAK DIBAIKI" stamp, big yellow title ("MASIH PECAH"), kicker chip,
captions, white flash out. Template: `templates/hook/index.html`. Render it as its own
project (`--sdr --crf 18`), then concat in front of the main render with ffmpeg
(`concat` filter, both 1080×1920 30fps 48 kHz stereo) and run `share.sh` on the joined file.
Keep the hook's SFX ≤ 0.3–0.35 so it is not louder than the body (check RMS of the first
2.5 s vs the next seconds).

## 5. Thumbnail (only after "dah siap")

`templates/thumbnail/index.html` — 1080×1920 single-frame composition: blurred footage
background + ink gradient, yellow top bar, mono kicker chip, 2-line League Gothic headline
(line 2 yellow, `white-space: nowrap`, fits one line each), the cut-out subject
(`remove-background` on a sharp frame where he faces camera) bottom-right slightly overlapping
the headline for depth, one before photo polaroid with "BEFORE · DEFECT", a warning chip,
footer bar (logo card + WhatsApp). Keep key text inside y 285–1635 (Instagram grid crop).
Render: `npx hyperframes snapshot --at 0.5` → `snapshots/frame-00-at-0.5s.png`; send the PNG.

## 6. Editing rules + gotchas learned

- Cut: false starts (keep the complete retake), repeated phrases, fillers ("apa ni", "Okay?",
  "So…"), stutters ("kita nak kep…"), pauses > 0.3 s, and Whisper's hallucinated
  "Terima kasih kerana menonton" over silence at the end.
- Find boundaries with `scripts/pieces.py` + `scripts/envelope.py`, then **verify every kept
  range** with `scripts/verify.py` before building (word cut-offs show up as garbled endings).
- Captions come from ASR — tell the client to check spelling of key words.
- Render with `--sdr`: iPhone HDR sources take a layered path that dropped overlays.
- Files around 50 MB fail to send — always send the `share.sh` copy.
- Different source resolutions in one video are fine (use the sharper take where it overlaps).
- Work in the scratchpad (`videos/<project>/`); never commit footage or renders to this repo.
