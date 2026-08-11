# Laman Web GoXpert — Building Surveying & Inspection

**Satu fail sahaja:** `website/index.html` — download, klik dua kali, terus jalan.
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
| Servis (semua 16, ikut kategori) | `index.html#/services` | ✅ Siap |
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
- **`BLOG`** — artikel (slug, kategori, tarikh, masa baca, tajuk, petikan, isi). Panduan tulis artikel baharu ada dalam komen di atas blok ini
- **`FAQ_ALL`** — 39 soalan FAQ (`cat` = kategori, `home: true` = papar juga di home)
- **`ABOUT`** — page Tentang Kami: cerita, prinsip, kelayakan, **garis masa** (isi tahun).
  Blok `team` masih ada dalam data tetapi seksyen pasukan sudah dibuang dari page
- **`PROJECTS`** — 58 projek (home papar 6 pertama, page `#/projects` papar semua).
  Setiap projek ada `photos: []` — gambar pertama jadi kad, klik kad buka
  semua gambar projek itu dalam lightbox. Kategori: `residential`,
  `commercial`, `infrastructure`, `public`, `land`.
  `name` dwibahasa — `{ en: "Temple 1", bm: "Kuil 1" }`
- **`AUDIENCES` / `WHYUS` / `EQUIPMENT` / `PROCESS` / `SERVICES_LIST` / `FAQS`** — kandungan seksyen
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
| `img/` (root) | 5 gambar re-inspection (before/after) |

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
