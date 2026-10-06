---
name: goxpert-defect-thumbnail
description: GoXpert Solutions "Defect apa harini??" defects-showcase THUMBNAIL — the client-approved fixed design (yellow background, navy/blue bold Montserrat text, GoXpert logo card, defect photo in a tilted red frame, red sticker, navy pill with the defect name). Use whenever the user sends a screenshot/photo of a defect and asks for a thumbnail/cover, or says "buat thumbnail" for the defects showcase series. Keep every thumbnail identical in layout and colour — only the photo and words change.
---

# GoXpert "Defect apa harini??" thumbnail

**FINAL — locked by the client on 2026-10-05 ("oke final").** Client (Malay-speaking, writes casual
Malay): layout from their reference ("TILES BUNYI KOSONG?" style), then **colours inverted at their
request** (yellow background, blue text), then a bigger photo card and yellow gradient top and bottom.
The first approved output was "AIR LAMBAT / TURUN?" + "FLOOR TRAP TERSUMBAT". Every future screenshot gets **exactly this design**. Do not change colours,
fonts, positions, logo, sticker style or the bottom line unless the client asks. Talk to the
client in casual Malay.

## Design (fixed)

| Element | Spec |
|---|---|
| Canvas | 1080×1920 PNG (9:16) |
| Background | the photo blurred 10px, with a yellow `#fcd116` gradient: solid at the top (to ~22%) and bottom (from ~80%), almost clear in the middle so the photo shows behind the card (client asked 2026-10-05) |
| Logo | `goxpert-video/assets/logo.png` on a white card, radius 26px, top centre (y 150) |
| Line 1 | SYMPTOM question start — Montserrat 900, uppercase, navy `#161b2e`, white 6px stroke + white hard shadow, max 138px |
| Line 2 | big punch line — same style, blue `#084c96`, max 215px |
| Photo card | **880×754** (enlarged on request), 14px red `#e63b3b` border, rotated −3°, navy drop shadow |
| Sticker | red, white 8px border, radius 16, rotated −7°, overlapping the card's bottom-right; default **AWAS!** |
| Kicker | "Defect apa harini??" — Montserrat 800, navy, white stroke |
| Pill | navy, radius 28, yellow text — the defect NAME in Malay (e.g. FLOOR TRAP TERSUMBAT) |
| Bottom line | "Semak sebelum tamat DLP", Montserrat 700, navy |

Text that is too long shrinks automatically (`window.__hyperframes.fitTextFontSize`), never grows.
It looks best with line 1 ≤ ~12 characters, line 2 ≤ ~8, pill ≤ ~20, sticker ≤ ~8.

## Workflow when a screenshot arrives

1. Look at the screenshot. Note phone UI (status bar, WhatsApp/TikTok overlays) and find the defect.
2. Write the words (Malay):
   - **line1 + line2 = the symptom the homeowner notices, as a question**: "AIR LAMBAT / TURUN?",
     "TILES BUNYI / KOSONG?", "DINDING / RETAK?". Not the technical name.
   - **pill = the defect name**: "FLOOR TRAP TERSUMBAT", "HOLLOW TILES", "RETAK DINDING".
   - sticker: "AWAS!" by default. Use "BAHAYA!" only when it really is a safety or structural risk.
   - If you can't tell what the defect is, ask before making it. Don't guess a scary label.
3. Pick the crop: a region `[x, y, w, h]` of the screenshot without phone UI, with the defect
   near the centre (the card is 7:6; the script defaults to a centred 7:6 crop).
4. Make it. In a fresh session, first run `command -v hyperframes || npm i -g hyperframes@0.8.132`
   (don't use `npx -y hyperframes`: it tries a newer version that doesn't exist). Montserrat
   downloads automatically on the first run.
   ```bash
   cat > thumb.json <<'EOF'
   { "photo": "ss.jpg", "crop": [0, 220, 1080, 926],
     "line1": "Air Lambat", "line2": "Turun?", "pill": "Floor Trap Tersumbat",
     "out": "Thumbnail-<defect>.png" }
   EOF
   python3 <this skill>/make_thumb.py thumb.json <scratchpad>/thumb-build
   ```
   Optional keys: `bg` (another image for the background), `sticker`, `kicker`, `sub`.
   Video input works too (it takes frame 0). For a specific moment, extract that frame to a JPG first.
5. If there is a video for it, put the PNG in as the video's **first 2.0 s** (0.7 s was too short to read), followed by the clean
   footage with **no text overlays** (client rule, 2026-10-06; see goxpert-video §4c), then send both files.
6. Look at the PNG yourself (text fits, defect visible, sticker not covering the defect), send it
   with SendUserFile, and ask: "Thumbnail ni okay, atau nak tukar apa-apa?"
7. Work in the scratchpad; never commit screenshots or PNGs to the repo.

`check` may flag `text_occluded` on a long sticker over the photo. That is a false positive (the
sticker is on top). Contrast warnings on line 2 mean the blue was changed; keep `#084c96`.

## Suggest improvements (client rule)

With every thumbnail, add a short "Cadangan" line, e.g. a sharper original photo instead of a
WhatsApp-compressed screenshot, or a stronger symptom question. Suggest only. Change the design
only on the client's yes, and record any accepted change here so it becomes the new default.
