# Laman Web GoXpert — Building Surveying & Inspection

**Dua bentuk:**
- `website/index.html` — satu fail, untuk edit & test cepat (klik dua kali, terus jalan)
- `website/dist/` — laman siap terbit, 29 fail HTML berasingan (lihat di bawah)
Berasingan sepenuhnya daripada app GoInspect di root repo.

## Status

Semua "page" berada dalam satu fail `index.html` (hash routing `#/...`):

| Page | URL | Status |
|---|---|---|
| Home | `index.html` | ✅ Siap |
| Tentang Kami | `index.html#/about` | ✅ Siap (tanpa seksyen pasukan) |
| FAQ penuh (39 soalan, 7 kategori) | `index.html#/faq` | ✅ Siap |
| Galeri gambar | `index.html#/gallery` | ✅ Siap (37 gambar, 6 kategori) |
| Blog / Artikel | `index.html#/blog` | ✅ Siap (6 artikel) |
| Artikel penuh | `index.html#/blog/<slug>` cth `#/blog/dlp-guide` | ✅ Siap |
| Projek (senarai penuh + penapis) | `index.html#/projects` | ✅ Siap (58 projek, 143 gambar) |
| Servis (semua 16, ikut kategori) | `index.html#/services` | ✅ Siap — setiap kad ada gambar |
| Sub-page setiap servis | `index.html#/services/<slug>` cth `#/services/bca` | ✅ Siap (16 servis) |

### Sub-page servis: kandungan penuh

| Kategori | Servis | Kandungan khas |
|---|---|---|
| Kediaman | Home Defect (DLP) | 12 elemen · tools · thermal · drone · report · sticker |
| Kediaman | Pre-Purchase | 11 kad nilai · DMS 11 ciri · galeri sistem |
| Kediaman | Sub-Sale | 10 kad nilai · DMS · galeri sistem |
| Kediaman | Re-Inspection | 6 status · analisis donut · jadual Before/After |
| Kediaman | After-Renovation | 6 kad nilai · 4 langkah · 6 zon risiko |
| Kediaman | Joint Inspection | 6 kad nilai · 4 langkah · 2 situasi (pemaju pertikai / tutup defect) |
| Komersial | BCA | 6 kad nilai · 4 peringkat · 4 gred keadaan · donut · 7 sistem |
| Komersial | Dilapidation | 6 kad nilai · 4 peringkat · jadual Sebelum/Selepas pembinaan · 6 kawasan |
| Komersial | Building Monitoring | 6 kad nilai · 4 peringkat · 4 klasifikasi pergerakan · 4 jenis |
| Komersial | Commercial Inspection | 6 kad nilai · 4 peringkat · 6 sistem |
| Komersial | Maintenance Audit | 6 kad nilai · 4 peringkat · 4 tahap keutamaan · donut · 6 kawasan |
| Teknikal | Electrical Inspection | 6 kad nilai · 4 peringkat · 4 klasifikasi keputusan · donut · 7 ujian |
| Teknikal | Leak Detection | 6 kad nilai · 4 peringkat · 4 klasifikasi lembapan · 6 punca bocor |
| Teknikal | Thermal Imaging | 6 kad nilai · 4 peringkat · 5 aplikasi · thermal reveal |
| Teknikal | Rectification Defect | 6 kad nilai · 4 peringkat · 6 "cara salah vs cara betul" |
| Teknikal | Tribunal | 6 kad nilai · 4 peringkat · 5 elemen pek bukti |

**Semua 16 servis kini ada kandungan penuh.**

## Home page — susunan seksyen

Hero → Servis (3 tiang + butang **Lihat Lebih Banyak Servis**) →
**Thermal reveal ikut scroll** → **Bumbung + drone terbang** → Statistik →
Untuk Siapa → Kenapa Kami → Projek (6) → Peralatan → Proses → Review →
**Liputan negeri (peta pin interaktif)** → FAQ → Hubungi

Seksyen thermal & drone guna gambar dari hosting `arleta.site`
(atribut `data-src` dalam HTML). Kalau gambar gagal load, seksyen itu
tersembunyi automatik.

## Untuk terbit (deploy) — folder `dist/`

`dist/` ialah laman siap terbit: **satu fail HTML untuk setiap page**,
URL sebenar, dan kandungan sudah tertulis dalam HTML (bukan dijana oleh
JavaScript). Muat naik kandungan folder `dist/` ke root domain.

```
dist/
  index.html                 ->  goxpert.my/
  services/index.html        ->  goxpert.my/services/
  services/<slug>/index.html ->  goxpert.my/services/bca/  (16 servis)
  projects/  gallery/  about/  faq/  blog/
  blog/<slug>/index.html     ->  goxpert.my/blog/dlp-guide/  (6 artikel)
  assets/style.css           CSS dikongsi (cache sekali)
  assets/app.js              JS dikongsi (cache sekali)
  img/                       semua gambar
  sitemap.xml  robots.txt  llms.txt  404.html
```

29 page kesemuanya.

**Bina semula selepas edit `index.html`:**

```
cd website
npm install playwright-core          # sekali sahaja
node build.js
```

Jangan edit fail dalam `dist/` — ia ditulis semula setiap kali build.
Sumber tunggal ialah `index.html`.

**Bila domain sebenar sedia:** tukar `siteUrl` dalam `CONFIG`
(dalam `index.html`) kemudian bina semula. Semua canonical, Open Graph,
sitemap dan llms.txt ikut nilai itu.

## Supaya Google & pembantu AI faham kita

Setiap page membawa data berstruktur (JSON-LD) yang menerangkan
syarikat, servis dan artikel dalam bentuk yang mesin boleh baca:

| Page | Data berstruktur |
|---|---|
| Semua | `ProfessionalService` (nama sah, no. pendaftaran, telefon, e-mel, kawasan, waktu, kelayakan RISM & kalibrasi SIRIM, 16 servis) + `WebSite` |
| Sub-page | `BreadcrumbList` |
| Setiap servis | `Service` + senarai apa yang termasuk |
| Setiap artikel | `BlogPosting` (tajuk, tarikh, gambar, penulis) |
| FAQ | `FAQPage` (39 soalan & jawapan) |

Ditambah:

- **`llms.txt`** — ringkasan teks biasa untuk pembantu AI: fakta syarikat,
  apa kepakaran kita, senarai servis dengan pautan, dan siapa patut
  hubungi kita
- **`sitemap.xml`** — 29 URL, hantar ke Google Search Console
- **`robots.txt`** — benarkan semua, tunjuk sitemap dan llms.txt
- Setiap page ada `<title>`, penerangan, `canonical` dan satu `<h1>` sendiri
- Kandungan tertulis terus dalam HTML — crawler yang tidak jalankan
  JavaScript tetap baca semuanya

Semua ini fakta terbuka yang boleh disemak sesiapa. Tiada teks
tersembunyi atau arahan rahsia kepada AI — enjin carian dan pembantu AI
menghukum taktik begitu, dan ia bercanggah dengan jenama firma yang
menjual integriti pemeriksaan.

## Telefon & butang back

- Semua animasi berfungsi di telefon: thermal reveal & drone ikut scroll,
  slideshow servis boleh **leret kiri/kanan**, carousel review boleh leret,
  lightbox boleh leret dan **leret ke bawah untuk tutup**
- Keadaan `hover` yang membawa maklumat sudah ada padanan sentuh:
  peta liputan **ditekan** untuk serlahkan negeri, butang zoom projek dan
  kapsyen galeri sentiasa nampak di telefon
- **Butang back telefon**: tutup lightbox dahulu (tidak terus keluar dari
  page), kemudian kembali ke page sebelumnya. Dalam `dist/` setiap page
  ialah URL sebenar, jadi back/forward berfungsi seperti laman biasa


## Keputusan reka bentuk (dipersetujui)

- **Positioning:** Firma Building Surveyor (bukan home inspection sahaja) — 3 tiang servis: Residential / Commercial & Asset / Technical & Legal
- **GoInspect:** laman berasingan (tidak dicampur di sini)
- **Bahasa:** English utama, butang tukar ke BM (pilihan disimpan dalam browser)
- **Tiada** intro screen, **tiada** lagu latar
- Tema: biru `#1565C0`, font DM Sans

## Cara edit

Buka `index.html`, cari bahagian atas `<script>`:

- **`CONFIG`** — nama syarikat (GO XPERT SOLUTION), no. pendaftaran
  `202503234804 (003768196-A)`, telefon, email, base URL gambar
- **`I18N`** — semua teks EN/BM
- **`SVC`** — 16 servis + kandungan sub-page setiap servis (nama, tagline, penerangan, apa termasuk, apa diterima).
  `gal: [...]` = senarai gambar yang **auto-slide** di kepala sub-page
  (tukar setiap 4 saat, ada dot, boleh leret di telefon, klik = lightbox).
  Gambar pertama dalam `gal` juga jadi `img`
- **`SVC_EXTRAS`** — kandungan khas setiap sub-page servis (kad nilai, langkah, elemen, status, analisis)
- **`GALLERY`** — galeri gambar (`cat`: team/site/defect/project/equipment). Panduan tambah gambar ada dalam komen
- **`BLOG`** — artikel (slug, kategori, tarikh, masa baca, tajuk, petikan, isi).
  `cover` = gambar kepala artikel + kad senarai.
  `figs: [{ at, img, cap }]` = gambar dalam badan artikel; `at` ialah
  nombor blok dalam `body` (gambar dipapar SELEPAS blok itu).
  Panduan tulis artikel baharu ada dalam komen di atas blok ini
- **`FAQ_ALL`** — 39 soalan FAQ (`cat` = kategori, `home: true` = papar juga di home)
- **`ABOUT`** — page Tentang Kami: cerita, prinsip, kelayakan, **garis masa** (isi tahun).
  Blok `team` masih ada dalam data tetapi seksyen pasukan sudah dibuang dari page
- **`PROJECTS`** — 58 projek (home papar 6 pertama, page `#/projects` papar semua).
  Setiap projek ada `photos: []` — gambar pertama jadi kad, klik kad buka
  semua gambar projek itu dalam lightbox. Kategori: `residential`,
  `commercial`, `infrastructure`, `public`, `land`.
  `name` dwibahasa — `{ en: "Temple 1", bm: "Kuil 1" }`
- **`EQUIPMENT`** — 6 alat, semua guna gambar tempatan dalam `img/svc/`
- **`AUDIENCES` / `WHYUS` / `PROCESS` / `SERVICES_LIST` / `FAQS`** — kandungan seksyen
- Warna: blok `:root` di bahagian atas `<style>`

## SEO & kongsi (siap)

- **Open Graph / Twitter** — pratonton kemas bila link dikongsi di WhatsApp/FB
- **Favicon** — terbina dalam fail (SVG data URI), tiada fail luar
- **JSON-LD** — `ProfessionalService` (telefon, kawasan, waktu, 16 servis) +
  `FAQPage` (39 soalan) dijana automatik dari data

**Bila deploy:** tukar `goxpert.my` dalam blok meta `<head>` kepada domain sebenar,
dan ganti `og:image` dengan gambar 1200×630 px sendiri.

## Gambar

Gambar sebenar sudah dimasukkan ke dalam folder `img/` (≈38 MB):

| Folder | Isi |
|---|---|
| `img/svc/<servis>/` | 54 gambar slideshow untuk 12 sub-page servis |
| `img/proj/` | 143 gambar untuk 58 projek |
| `img/gal/` | 20 gambar pasukan / di tapak / ACPIM / latihan |
| `img/` (root) | logo, pasangan thermal, 5 gambar re-inspection |
| `img/sticker/` | 7 sticker penanda defect (PNG latar telus) |
| `img/review/` | 9 review pelanggan |
| `img/report/` | 5 muka surat sample report |
| `img/dms/` | 7 paparan sistem pengurusan defect |
| `img/t/` | thumbnail 560px untuk grid — dijana automatik, jangan edit |

**Prestasi:** gambar penuh dihadkan 900px (JPEG q72) untuk lightbox &
kepala page. Grid (kad projek, galeri, kad servis, kad blog) guna
thumbnail `img/t/...` (560px, ±45 KB) — kira-kira 55% lebih ringan.
Semua gambar grid `loading="lazy"`, dan slideshow servis hanya muat
slaid semasa + satu berikutnya. Kalau thumbnail hilang, gambar penuh
digunakan automatik.

> **Semua gambar kini dalam folder `img/` — tiada hosting luar langsung.**
> Hosting lama `arleta.site` sudah mati dan tiada apa-apa lagi bergantung
> padanya. Satu-satunya yang belum ada ialah **fail PDF sample report**:
> letak PDF dalam folder website, kemudian isi `pdf:` dalam
> `SVC_EXTRAS["home-defect"]` untuk hidupkan butang muat turun.

**Cara rujuk gambar dalam data:**
- `"img/xxx.jpg"` — fail tempatan (guna terus)
- `"ARLETA:Nama.png"` — hosting lama `https://arleta.site/interactivelink/1453/`
  (hanya tinggal gambar peralatan & beberapa grafik teknikal)
- `""` — placeholder kemas dipaparkan

Jika mana-mana gambar gagal load, fallback (ikon/teks) dipaparkan automatik —
layout tak pernah pecah.

## Rujukan penuh extract design lama

Senarai penuh warna, gambar, link & struktur dari 2 fail HTML asal ada dalam
perbualan Claude (sesi `claude/company-website-lnp12i`).
