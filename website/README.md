# Laman Web GoXpert — Building Surveying & Inspection

**Satu fail sahaja:** `website/index.html` — download, klik dua kali, terus jalan.
Berasingan sepenuhnya daripada app GoInspect di root repo.

## Status

Semua "page" berada dalam satu fail `index.html` (hash routing `#/...`):

| Page | URL | Status |
|---|---|---|
| Home | `index.html` | ✅ Siap |
| Tentang Kami | `index.html#/about` | ✅ Siap |
| FAQ penuh (39 soalan, 7 kategori) | `index.html#/faq` | ✅ Siap |
| Blog / Artikel | `index.html#/blog` | ✅ Siap (6 artikel) |
| Artikel penuh | `index.html#/blog/<slug>` cth `#/blog/dlp-guide` | ✅ Siap |
| Projek (senarai penuh + penapis) | `index.html#/projects` | ✅ Siap |
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

## Keputusan reka bentuk (dipersetujui)

- **Positioning:** Firma Building Surveyor (bukan home inspection sahaja) — 3 tiang servis: Residential / Commercial & Asset / Technical & Legal
- **GoInspect:** laman berasingan (tidak dicampur di sini)
- **Bahasa:** English utama, butang tukar ke BM (pilihan disimpan dalam browser)
- **Tiada** intro screen, **tiada** lagu latar
- Tema: biru `#1565C0`, font DM Sans

## Cara edit

Buka `index.html`, cari bahagian atas `<script>`:

- **`CONFIG`** — nama syarikat, SSM, telefon, email, base URL gambar
- **`I18N`** — semua teks EN/BM
- **`SVC`** — 16 servis + kandungan sub-page setiap servis (nama, tagline, penerangan, apa termasuk, apa diterima)
- **`SVC_EXTRAS`** — kandungan khas setiap sub-page servis (kad nilai, langkah, elemen, status, analisis)
- **`BLOG`** — artikel (slug, kategori, tarikh, masa baca, tajuk, petikan, isi). Panduan tulis artikel baharu ada dalam komen di atas blok ini
- **`FAQ_ALL`** — 39 soalan FAQ (`cat` = kategori, `home: true` = papar juga di home)
- **`ABOUT`** — page Tentang Kami: cerita, prinsip, kelayakan, **pasukan** (isi nama + `photo`), **garis masa** (isi tahun)
- **`PROJECTS`** — senarai projek (home papar 6 pertama, page `#/projects` papar semua)
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

Semua gambar masih guna hosting lama `https://arleta.site/interactivelink/1453/`.
Jika gambar gagal load, fallback (emoji/teks) akan dipaparkan secara automatik.

**Penting:** bila bersedia, download semua gambar, letak dalam folder `img/`
di sebelah `index.html`, kemudian tukar `imgBase` dalam CONFIG kepada `"img/"`.

## Rujukan penuh extract design lama

Senarai penuh warna, gambar, link & struktur dari 2 fail HTML asal ada dalam
perbualan Claude (sesi `claude/company-website-lnp12i`).
