# Laman Web GoXpert — Building Surveying & Inspection

**Satu fail sahaja:** `website/index.html` — download, klik dua kali, terus jalan.
Berasingan sepenuhnya daripada app GoInspect di root repo.

## Status

Semua "page" berada dalam satu fail `index.html` (hash routing `#/...`):

| Page | URL | Status |
|---|---|---|
| Home | `index.html` | ✅ Siap |
| Projek (senarai penuh + penapis) | `index.html#/projects` | ✅ Siap |
| Servis (semua 15, ikut kategori) | `index.html#/services` | ✅ Siap |
| Sub-page setiap servis | `index.html#/services/<slug>` cth `#/services/bca` | ✅ Siap (15 servis) |
| Tentang Kami, Sample Report, dll. | — | ⏳ Ikut arahan |

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
- **`SVC`** — 15 servis + kandungan sub-page setiap servis (nama, tagline, penerangan, apa termasuk, apa diterima)
- **`PROJECTS`** — senarai projek (home papar 6 pertama, page `#/projects` papar semua)
- **`AUDIENCES` / `WHYUS` / `EQUIPMENT` / `PROCESS` / `SERVICES_LIST` / `FAQS`** — kandungan seksyen
- Warna: blok `:root` di bahagian atas `<style>`

## Gambar

Semua gambar masih guna hosting lama `https://arleta.site/interactivelink/1453/`.
Jika gambar gagal load, fallback (emoji/teks) akan dipaparkan secara automatik.

**Penting:** bila bersedia, download semua gambar, letak dalam folder `img/`
di sebelah `index.html`, kemudian tukar `imgBase` dalam CONFIG kepada `"img/"`.

## Rujukan penuh extract design lama

Senarai penuh warna, gambar, link & struktur dari 2 fail HTML asal ada dalam
perbualan Claude (sesi `claude/company-website-lnp12i`).
