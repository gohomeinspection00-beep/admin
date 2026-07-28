# GoXpert — Building Inspection Profesional Malaysia

Website rasmi syarikat GoXpert Building Inspection. Dibina semula daripada website lama dengan struktur projek yang bersih.

## Struktur

```
index.html      — semua kandungan halaman (intro, hero, servis, kawasan, kenapa kami, hubungi)
css/styles.css  — semua styling; tema dikawal melalui CSS variables di :root
js/main.js      — intro screen, audio, carousel, animasi reveal, borang WhatsApp
assets/img/     — untuk logo dan gambar (buat masa ini gambar masih dari hosting arleta.site)
```

## Tema

Font: **DM Sans**. Warna utama dalam `:root` di `css/styles.css`:

- `--primary: #1565C0` (biru corporate)
- `--accent: #2196F3`
- `--orange: #FF6B35`

## Kandungan utama

- Intro screen dengan logo + muzik latar
- Hero dengan stats (5000+ unit diperiksa, 98+ projek, 13+ inspector, 4 negeri)
- Peralatan SIRIM (parallax), Sticker Khas, Thermal Imaging
- Testimoni client (carousel), Poster (modal)
- Senarai penuh 15 servis inspection
- Kawasan liputan: Johor, Melaka, Negeri Sembilan, Selangor
- Borang pertanyaan → hantar terus ke WhatsApp (+6011-3144 6591)

## Cara run

```
python3 -m http.server 8000
```

Kemudian buka http://localhost:8000

## Nota

Gambar dan audio masih dihoskan di `arleta.site`. Jika mahu website ini self-contained,
muat turun aset tersebut ke `assets/img/` dan kemas kini URL dalam `index.html`.
