# Remotion — edit video GoXpert

Video dibina dengan React (https://www.remotion.dev). Projek ni berasingan dari admin panel dan dari skill `goxpert-video` (HyperFrames).
Panduan untuk Claude: `.claude/skills/remotion-video/SKILL.md`.

```bash
cd remotion
npm install
npm run studio                                   # buka editor dalam browser (localhost:3000)
npx remotion render HelloGoXpert out/hello.mp4   # render MP4
npx remotion still HelloGoXpert out/f.png --frame=60
```

- Komposisi didaftar dalam `src/Root.tsx`; contoh: `src/HelloGoXpert.tsx` (1080×1920, 30fps, warna brand).
- Letak footage/gambar dalam `public/` dan guna `<OffthreadVideo src={staticFile("x.mp4")} />`.
- Dalam container Claude cloud, `remotion.media` disekat — `remotion.config.ts` auto guna
  chrome-headless-shell yang dah terpasang. Di komputer sendiri, Remotion download Chrome sendiri.
- Lesen: percuma untuk individu & syarikat ≤ 3 pekerja. Lebih dari tu perlu Company License
  (https://www.remotion.dev/license).
