# Laman Web Syarikat — Go Home Inspection

Folder ini ialah **tempat untuk laman web syarikat**, berasingan sepenuhnya
daripada aplikasi GoInspect (`index.html` dan `admin_panel.html` di root repo).
Apa-apa perubahan di sini tidak menyentuh app.

## Struktur

```
website/
├── index.html          # Halaman utama (struktur & susunan seksyen)
├── css/style.css       # Semua gaya. Tukar warna di :root
├── js/config.js        # ← EDIT DI SINI: nama, telefon, e-mel, servis, pakej, FAQ
├── js/main.js          # Logik (bahasa BM/EN, borang WhatsApp, menu). Jarang perlu diubah
└── assets/img/         # Gambar: logo, hero, team, favicon, og-image
```

## Cara edit (paling kerap)

Buka `js/config.js` sahaja. Semua teks laman diambil dari fail itu:

| Mahu ubah | Edit bahagian |
|---|---|
| Nama syarikat, no. SSM | `companyName`, `legalName`, `ssm` |
| Telefon / WhatsApp | `phone` dan `phoneRaw` (nombor sahaja, cth `601131446591`) |
| E-mel, alamat, waktu operasi | `email`, `address`, `hours` |
| Senarai perkhidmatan | `services[]` |
| Langkah proses kerja | `steps[]` |
| Harga pakej | `packages[]` — set `packages: []` untuk sembunyikan seksyen harga |
| Testimoni | `testimonials[]` — set `[]` untuk sembunyikan |
| Soalan lazim | `faqs[]` |
| Media sosial | `social` — biarkan kosong `""` jika tiada |

Setiap teks boleh ditulis dua bahasa: `{ bm: "...", en: "..." }`.
Butang **EN / BM** di header menukar bahasa dan pilihan itu disimpan dalam browser.

## Gambar yang perlu dimasukkan

Letakkan fail-fail ini dalam `assets/img/` (nama mesti sama):

| Fail | Guna | Saiz cadangan |
|---|---|---|
| `logo.png` | Logo di header | tinggi 64px, latar telus |
| `hero.jpg` | Gambar besar di atas | 1200 × 900 px |
| `team.jpg` | Gambar pasukan (seksyen Tentang) | 1000 × 800 px |
| `favicon.png` | Ikon tab browser | 64 × 64 px |
| `og-image.jpg` | Pratonton bila dikongsi di WhatsApp/FB | 1200 × 630 px |

Selagi gambar belum ada, laman tetap berfungsi — kotak bergaris putus-putus
akan tunjuk di mana gambar patut diletak.

## Lihat laman di komputer

```bash
cd website
python3 -m http.server 8080
# buka http://localhost:8080
```

Boleh juga buka `website/index.html` terus dalam browser.

## Cara terbitkan (deploy)

### Pilihan A — Firebase Hosting (repo ini sudah guna Firebase)

Tambah blok `hosting` dalam `firebase.json` di root:

```json
"hosting": {
  "public": "website",
  "ignore": ["firebase.json", "**/.*", "**/node_modules/**"]
}
```

Kemudian:

```bash
firebase deploy --only hosting
```

> Nota: `firebase.json` di root belum ada blok `hosting` — sengaja dibiarkan
> supaya deploy tidak berlaku tanpa kebenaran anda. Tambah bila anda sudah bersedia.

### Pilihan B — Netlify / Vercel / Cloudflare Pages

Sambung repo, set **publish directory** kepada `website`, tiada build command.

### Pilihan C — GitHub Pages

Settings → Pages → pilih branch, folder `/website`.

## Domain sendiri

Selepas deploy, sambungkan domain (cth `gohomeinspection.com`) melalui panel
hosting yang dipilih, kemudian kemas kini rekod DNS mengikut arahan yang diberi.
