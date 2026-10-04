---
name: remotion-video
description: Edit or create videos with Remotion (React) in the `remotion/` project. Use ONLY when the user explicitly asks for Remotion (e.g. "guna Remotion", "buat dengan Remotion", "Remotion studio"). Inspection reels/TikTok in the approved GoXpert house style are NOT this skill — those use `goxpert-video` (HyperFrames) unless the user says Remotion.
---

# Remotion video (separate from `goxpert-video`)

This skill and `goxpert-video` are independent:

| | `goxpert-video` | `remotion-video` (this) |
|---|---|---|
| Engine | HyperFrames (HTML + GSAP) | Remotion (React + TypeScript) |
| Project | built per video from `.claude/skills/goxpert-video/templates/` | `remotion/` at repo root |
| When | default for any inspection video / reel / thumbnail | only when the user asks for Remotion |

Do not import, copy or depend on files from `.claude/skills/goxpert-video/` here, and do not
change that skill while doing Remotion work. If the user wants the GoXpert house style in Remotion,
ask first, then re-implement it inside `remotion/src/`.

Talk to the user in casual Malay.

## Setup (every new session — container is fresh)

```bash
cd remotion && npm install
```

`remotion.media` is blocked in the cloud container, so Remotion cannot download its own Chrome.
`remotion/remotion.config.ts` already points it at the preinstalled
`/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell`. Do not use
`/opt/pw-browsers/chromium` (full Chrome — fails with "Old Headless mode has been removed").
`ffmpeg`/`ffprobe` are on PATH for probing footage.

## Project layout

- `src/index.ts` — `registerRoot`
- `src/Root.tsx` — register every video as a `<Composition id=… durationInFrames fps width height />`
- `src/<Name>.tsx` — one component per video; `src/HelloGoXpert.tsx` is the sample (1080×1920, 30 fps)
- `public/` — footage, photos, audio; reference with `staticFile("name.mp4")`
- `out/` — renders (git-ignored)

## Building a video

1. Probe the footage first: `ffprobe -v error -show_entries stream=width,height,r_frame_rate:format=duration -of compact public/x.mp4`.
   Ask where it will be posted (TikTok/Reels/Shorts → 1080×1920; FB/IG feed → 1080×1350; YouTube → 1920×1080).
2. Copy footage into `remotion/public/`. Large media should not be committed — add it to `.gitignore` if needed.
3. Use `<OffthreadVideo>` for footage, `<Sequence from durationInFrames>` / `<Series>` for cuts,
   `<Audio>` for music/SFX, `interpolate` + `spring` for motion. Animate only from `useCurrentFrame()`
   (no CSS transitions, no `setTimeout`) so renders are deterministic.
4. Trim with `<OffthreadVideo startFrom={…} endAt={…}>` (frames at the composition fps).
5. Type-check, then render:
   ```bash
   npx tsc
   npx remotion still <Id> out/check.png --frame=<n>   # look at key frames before full render
   npx remotion render <Id> out/<name>.mp4
   ```
6. Verify with `ffprobe`, look at a few stills, then send the MP4 with SendUserFile.
7. After each draft ask: "Nak tukar apa-apa lagi, atau dah siap?"

## Licence

Remotion is free for individuals and companies with ≤ 3 employees; larger companies need a
Company License (https://www.remotion.dev/license). Mention this if the user plans regular commercial use.
