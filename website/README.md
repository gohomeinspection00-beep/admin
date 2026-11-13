# Laman Web GoXpert — Building Surveying & Inspection

**Dua bentuk:**
- `website/index.html` — satu fail, untuk edit & test cepat (klik dua kali, terus jalan)
- `website/dist/` — laman siap terbit, 68 fail HTML berasingan
  (34 page × 2 bahasa; 66 diindeks — lihat di bawah)
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
| Sub-page setiap servis | `index.html#/services/<slug>` cth `#/services/bca` | ✅ Siap (18 servis) |
| **Landing page pemilik rumah** | `index.html#/pemilik-rumah` | ✅ Siap (ada skrin intro + lagu) |

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
| Komersial | Fire Safety Inspection | 6 kad nilai · 4 peringkat · 6 kawasan masalah |
| Teknikal | Measured Drawing | 6 kad nilai · 4 peringkat · 6 sebab · butang borang Google |

**Semua 18 servis ada kandungan penuh.**

> **Fire Safety Inspection** sengaja menyatakan hadnya pada page itu
> sendiri: ia pemeriksaan keadaan dan dokumentasi, **bukan** pensijilan
> BOMBA dan bukan kelulusan pematuhan. Jangan buang ayat itu — ia
> melindungi syarikat daripada dakwaan perkhidmatan terkawal yang tidak
> dipegang.

> **Measured Drawing** ialah satu-satunya servis yang ada butang borang.
> Medan `form` dalam entri `SVC` menyimpan pautan Google Form; butang
> "Isi borang sebut harga" muncul di kad tepi hanya untuk servis yang
> ada medan itu.

## Home page — susunan seksyen

Hero → Servis (3 tiang + butang **Lihat Lebih Banyak Servis**) →
**Thermal reveal ikut scroll** → **Bumbung + drone terbang** → Statistik →
Untuk Siapa → Kenapa Kami → Projek (6) → Peralatan → Proses → Review →
**Liputan negeri (peta pin interaktif)** → FAQ → Hubungi

Seksyen thermal & drone guna gambar dari hosting `arleta.site`
(atribut `data-src` dalam HTML). Kalau gambar gagal load, seksyen itu
tersembunyi automatik.


## Landing page "Untuk Pemilik Rumah"

URL: `index.html#/pemilik-rumah` → terbit sebagai `goxpert.my/pemilik-rumah/`
Ada dalam menu atas (**Untuk Pemilik Rumah** / *For Homeowners*) dan footer.
Ini page untuk dikongsi terus (WhatsApp, Facebook, iklan) — bukan page jualan
berasingan, ia duduk dalam website yang sama.

**Beza dengan page lain:**
- Navbar utama disembunyikan; ganti dengan bar ringkas sendiri —
  ikon rumah **Laman Utama** (balik ke home) + butang tukar bahasa BM/EN.
- Ada skrin **intro** penuh: pelawat tekan *Tekan untuk teruskan* /
  *Tap to continue*, baru page terbuka dan lagu latar main.
  (Pelayar tak izinkan lagu main sendiri tanpa pelawat tekan apa-apa —
  sebab itulah butang intro ini wajib ada.)
- **Lagu latar** `files/goxpert-chorus.mp3` — kekuatan 10% dan berulang
  (sama macam landing page lama). Kelakuannya:
  | Keadaan | Lagu |
  |---|---|
  | Tukar ke tab lain / kecilkan tetingkap | berhenti sementara |
  | Balik ke tab landing | sambung semula |
  | Tekan butang pembesar suara | berhenti (kekal senyap walaupun tukar tab) |
  | Keluar ke page lain dalam website | berhenti terus dan reset |

**Susunan seksyen:** Intro → Hero → Statistik → 8 alat mengelilingi gambar
surveyor memegang sijil kalibrasi SIRIM (`img/sirim-person.webp`, animasi
pecah keluar bila masuk skrin) → **Bumbung + drone terbang ikut scroll** →
Sticker penanda defect (marquee berjalan + demo sticker) → Poster (popup,
kalau ada) → 4 kategori kerja → 4 risiko tanpa inspection → Senarai 15 servis
+ kad CTA WhatsApp → Kenapa Kami → Review pelanggan → Footer.

**Butang servis:** *Lihat Servis* di hero **scroll ke bawah dalam landing
page yang sama** (tak keluar ke mana-mana). Di bawah senarai servis ada
butang *Lebih Lanjut Tentang Servis* — barulah itu bawa ke page servis
penuh di website utama (`/services/`).

### Fail tambahan (semua sudah lengkap)

1. ~~Lagu latar~~ — **sudah ada** (`files/goxpert-chorus.mp3`). Kalau nak
   tukar lagu, ganti fail itu atau tukar nama di `LANDING_MUSIC` dalam
   `index.html`. Biar `""` kalau tak nak lagu langsung — skrin intro masih
   jalan, cuma senyap.

2. **Poster** — kesemua 13 poster sudah masuk (`img/poster/`).
   Untuk tambah lagi, letak fail dalam `website/img/poster/` dan
   senaraikan dalam `LANDING_POSTERS` dalam `index.html`:
   ```js
   var LANDING_POSTERS = [
       { img: "img/poster/sirim.jpg", en: "SIRIM-Calibrated Equipment",
                                      bm: "Peralatan Dikalibrasi SIRIM" },
       ...
   ];
   ```
   Tajuk dipapar dalam popup dan bertukar ikut bahasa. Kalau senarai ini
   kosong, **seksyen poster tersembunyi automatik** — tiada kotak kosong.

   **Nota:** poster Defect Inspection asalnya tertulis
   `www.gohomeinspection.asia` (domain lama). Baris itu telah ditampal
   dan ditukar kepada `www.goxpert.my` terus pada gambar.

Lepas tukar, jalankan `node build.js` semula untuk kemas kini `dist/`.


## Nama lama, media sosial, gambar kongsi

**Nama lama.** Syarikat ini dahulunya **Go Home Inspection (GOHI)**, dan
domain lama `gohomeinspection.asia` sudah tamat. Ejen dan pelanggan lama
masih merujuk nama itu; sesiapa yang mencarinya tidak menjumpai apa-apa.
`CONFIG.formerName` dalam `index.html` memaparkan baris "Dahulunya Go
Home Inspection (GOHI)" di footer, dan nama itu turut dimasukkan ke
dalam `alternateName` JSON-LD supaya Google mengaitkan kedua-dua nama.

> **Nota untuk sesiapa yang mengubah kod ini:** `build.js` menjana HTML
> dengan **memuat page dalam pelayar dan menyimpan DOM yang terhasil**.
> Jadi apa-apa penanda "sudah dipasang" yang disimpan dalam DOM —
> atribut seperti `data-wired`, atau semakan seperti
> `if (!box.childElementCount)` yang turut memasang pendengar klik —
> akan **ikut tersimpan ke dalam fail terbit**, dan pendengar itu tidak
> pernah dipasang pada laman sebenar. Butang nampak elok tetapi mati.
> Ini sudah berlaku tiga kali: butang poster, bintang review, dan
> carousel review landing page. Guna pemboleh ubah JS sebagai penanda,
> dan pisahkan "bina HTML" daripada "pasang pendengar".

**Pengenalan untuk mesin.** `dist/llms.txt` kini ada bahagian
**Identity** yang menyatakan dengan jelas: nama lama dan nama baharu
ialah syarikat yang sama, domain lama sudah tamat dan tidak lagi di
bawah kawalan syarikat, serta senarai akaun sosial, telefon dan emel
yang rasmi. Ini maklumat fakta yang boleh disemak — bukan arahan
tersembunyi — dan inilah yang membantu enjin carian serta pembantu AI
membezakan akaun semasa daripada yang lama. `robots.txt` menunjuk ke
fail itu.

Page Tentang Kami juga memaparkan nota yang sama secara **nampak**
kepada pelawat. Teks tersembunyi tidak digunakan di mana-mana: ia
dikesan sebagai spam, boleh menyebabkan laman dibuang dari carian, dan
pembantu AI melayan teks halaman sebagai maklumat, bukan arahan.

**Harga mula.** `CONFIG.priceFrom` (sekarang `300`) ialah angka yang
dipapar dalam FAQ "Berapa kos inspection?" dan dalam `llms.txt`. Tukar
di situ sahaja. Angka ini wujud kerana hasil carian Google pernah
memetik "bermula RM250" daripada post Facebook lama — harga yang sudah
tidak tepat. Menyatakannya di laman sendiri memberi Google sumber yang
sah untuk diambil. Kalau harga berubah lagi, tukar nombor itu, jalankan
`node build.js`, dan kemas kini juga post Facebook yang berkenaan.

**Media sosial.** `CONFIG.social` menyimpan pautan Facebook, Instagram,
TikTok dan Threads. Ia dipapar sebagai ikon di footer dan diberitahu
kepada Google melalui `sameAs`. Kosongkan senarai itu dan barisan ikon
tersembunyi automatik.

**Gambar kongsi.** `img/og-share.jpg` (1200×630) ialah gambar yang
muncul apabila pautan laman ini di-paste ke Facebook, WhatsApp atau
Threads. Sebelum ini gambar pasukan 900×600 digunakan, yang terpotong
pada saiz yang Facebook mahu. Untuk menukarnya, ganti fail itu dengan
gambar 1200×630 yang lain.

## Dwibahasa: Google boleh baca versi BM

Dulu laman terbit **semuanya dalam Bahasa Inggeris**. Teks BM hanya
muncul selepas pelayar jalankan JavaScript, jadi Google tak pernah
nampak. Orang yang cari *"inspection rumah baru"* atau *"jurukur
bangunan berdaftar"* takkan jumpa kita langsung.

Sekarang setiap page wujud sebagai **dua fail HTML sebenar**:

| Bahasa | URL | `<html lang>` |
|---|---|---|
| Inggeris | `goxpert.my/faq/` | `en` |
| Melayu | `goxpert.my/ms/faq/` | `ms` |

Setiap page membawa tag `hreflang` yang memberitahu Google kedua-dua URL
itu page yang sama dalam bahasa berbeza — jadi ia **tidak** dikira
kandungan bertindih (duplicate content). `sitemap.xml` turut
menyenaraikan kedua-duanya dengan anotasi `xhtml:link`.

**Butang tukar bahasa** dalam laman terbit tidak lagi sekadar menukar
teks — ia membawa pelawat ke URL bahasa yang satu lagi untuk page yang
sama (`/services/bca/` ↔ `/ms/services/bca/`). Dalam fail tunggal
`index.html`, ia masih bertukar terus tanpa muat semula.

Pautan dalam page BM semuanya menghala ke `/ms/...`, jadi pelawat kekal
dalam bahasa pilihannya sepanjang melayari laman.

JSON-LD juga mengikut bahasa: nama servis, tajuk artikel, FAQ dan
breadcrumb pada page BM semuanya dalam BM, dengan `inLanguage: ms-MY`.



## Page review (tidak diindeks)

URL: `index.html#/review` → terbit sebagai `goxpert.my/review/`
(dan `/ms/review/`). Dihantar melalui WhatsApp kepada pemilik selepas
inspection siap.

**Page ini tidak diindeks Google:** ia membawa
`<meta name="robots" content="noindex, nofollow">`, tiada dalam
`sitemap.xml`, tiada dalam `llms.txt`, dan **tiada page lain memaut
kepadanya**. Ia hanya sampai melalui link yang anda hantar sendiri.

> Tidak diindeks ≠ sulit. Sesiapa yang ada link boleh membukanya. Untuk
> page ini tiada masalah — tiada maklumat sulit di situ.

Pelawat memilih bintang, kemudian:

| Bintang | Apa berlaku |
|---|---|
| **5** | Popup "Terima kasih", kiraan 3 saat, lalu Google review dibuka |
| **1–4** | Borang dalaman terbuka terus, dihantar ke Google Form yang sama |

Tiada pilihan diberi kepada pelawat dalam kedua-dua kes.

### AMARAN: ini review gating

Aliran di atas menghantar hanya pelanggan 5 bintang ke Google. Google
**melarang** ini — polisi *Prohibited & Restricted Content* untuk review
melarang menapis atau memilih-milih siapa diminta memberi review. Jika
dikesan, semua review boleh dibuang dan Google Business Profile boleh
digantung.

Pemilik telah dimaklumkan dan memilih aliran ini. Untuk kembali kepada
aliran selamat, tukar satu baris dalam `CONFIG`:

```js
reviewGating: false,   // papar kedua-dua pilihan kepada semua pelanggan
```

Markup dan kod untuk aliran selamat itu masih ada dan berfungsi.

### Borang dalaman

Borang di laman ini POST terus ke Google Form yang sama, melalui iframe
tersembunyi. ID medan disimpan dalam `CONFIG.reviewFields`:

| Medan borang | Soalan Google Form |
|---|---|
| `entry.2016564230` | Your Name (Optional) |
| `entry.1393555004` | Inspection Date (`_year` / `_month` / `_day`) |
| `entry.313442101` | Review Inspection Quality — diisi dari bintang |
| `entry.1292019355` | Review Inspector |
| `entry.461575552` | General Comment |

#### Emel

Pemilik sengaja **mematikan** "Collect email addresses" di Google Forms
supaya emel bersifat sukarela. Akibatnya Google **membuang** medan khas
`emailAddress` yang borang kita hantar. Jadi:

- Emel adalah **pilihan**. Kosong pun boleh hantar; kalau diisi, format
  disemak.
- Selagi `CONFIG.reviewFields.emailEntry` kosong, emel **dilampirkan pada
  hujung komen** (`Emel: nama@contoh.com`) supaya ia tidak hilang.
- Isi `emailEntry` dengan ID soalan "Email" biasa (jenis *Short answer*)
  dalam borang, dan emel masuk ke lajurnya sendiri — lebih kemas untuk
  disusun kemudian.
- Emel juga tetap dihantar dalam medan khas `emailAddress`. Google
  membuangnya selagi "Collect email addresses" dimatikan, tetapi kalau
  ia dihidupkan semula nanti Google **mewajibkan** medan itu — tanpanya
  seluruh hantaran ditolak. Jadi ia dibiar di situ dengan sengaja.

#### Dua perkara yang boleh merosakkan ini tanpa amaran

1. **Jangan ubah susunan atau jenis soalan di Google Forms.** ID medan
   boleh berubah, dan hantaran akan gagal **senyap** — pelayar tidak
   dibenarkan membaca balasan Google (CORS), jadi kita tak dapat tahu.
2. **Jangan tanda mana-mana soalan sebagai Required di Google Forms.**
   Kalau hantaran kita tidak menyertakan soalan itu, Google menolak
   seluruh hantaran. Medan wajib dikawal oleh borang di laman ini.

Selepas apa-apa perubahan pada borang Google, hantar satu ujian melalui
`goxpert.my/review/` dan semak kiraan **Responses** bertambah.

### Pautan

Dalam `CONFIG`:

```js
reviewGoogle: "https://g.page/r/..../review",      // link review Google
reviewRedirectSec: 3,                              // saat sebelum dibuka
reviewPost: "https://docs.google.com/forms/d/e/..../formResponse",
reviewForm: "https://docs.google.com/forms/d/e/..../viewform",
```

`reviewForm` hanya digunakan bila `reviewGating` dimatikan.

## Page tempahan berkelompok

URL: `index.html#/inspection-berkelompok` → terbit sebagai
`goxpert.my/inspection-berkelompok/` (dan `/ms/inspection-berkelompok/`).

Dibina untuk satu kegunaan: **di-paste ke dalam kumpulan Facebook atau
WhatsApp projek perumahan**, di mana ramai pemilik perlukan inspection
pada masa yang sama selepas serahan kunci.

Page ini **tiada dalam menu atas** — ia page yang sampai melalui link
yang dikongsi, bukan page yang orang cari dalam menu. Ia ada di footer.

### Nama projek terus dalam link

Tambah `?projek=` pada link, dan page akan papar nama projek itu di
kepala page serta memasukkannya ke dalam mesej WhatsApp:

```
goxpert.my/inspection-berkelompok/?projek=Residensi%20Suria&vp=Mac%202026
```

- `projek` — nama projek seperti yang ahli kumpulan kenal
- `vp` — bulan serahan kunci (pilihan)

Gunakan `%20` untuk ruang, atau tanda `+`. Tiada apa-apa perlu dibina
semula — cuma tukar link yang di-paste. Tanpa `?projek=`, page papar
versi generik yang tetap berfungsi penuh.

### Harga

`GROUP_TIERS` dalam `index.html` menentukan jadual kadar. **Selagi
senarai itu kosong, jadual tersembunyi** dan page papar ajakan hubungi —
supaya tiada harga rekaan keluar ke laman sebenar. Isi begini:

```js
var GROUP_TIERS = [
    { units: { en: "5 – 9 units",   bm: "5 – 9 unit"   }, price: 550,
      save: { en: "Save 15%", bm: "Jimat 15%" } },
    { units: { en: "10 – 19 units", bm: "10 – 19 unit" }, price: 480,
      save: { en: "Save 25%", bm: "Jimat 25%" }, best: true },
    { units: { en: "20+ units",     bm: "20+ unit"     }, price: 420,
      save: { en: "Save 35%", bm: "Jimat 35%" } }
];
```

`price` nombor sahaja tanpa "RM". `best: true` menandakan satu tier
sebagai "Paling Dipilih". Syarat di bawah jadual ada dalam
`GROUP_PRICE_NOTE`.

Semua pendaftaran masuk melalui WhatsApp, sama seperti seluruh laman —
tiada borang atau pangkalan data untuk dijaga.

## Di mana laman ini hidup (Cloudflare)

Akaun Cloudflare `gohomeinspection00@gmail.com` ada **tiga Worker**.
Hanya satu daripadanya laman ini:

| Worker | Untuk apa | Sentuh? |
|---|---|---|
| **`proud-rain-b73f`** | **Laman ini.** Melayan `goxpert.my` dan `www.goxpert.my` | **Ya — ini sahaja** |
| `empty-voice-eaa7` | GoXpert Pocket (projek lain) | Jangan |
| `reinspection-form` | Borang re-inspection | Jangan |

`proud-rain-b73f` ialah Worker jenis **static assets** — ia melayan fail
terus, sama bentuk dengan `dist/`. Jadi menerbitkan versi baru bermakna
**mengganti isi Worker itu**, bukan memindahkan domain. Domain dan DNS
tidak perlu disentuh langsung, dan tiada masa mati.

`goxpert.my` sudah menjadi zone dalam akaun yang sama, jadi tiada kerja
nameserver yang tertunggak.

**Jangan** buat projek Pages baru untuk laman ini. Itu menghasilkan laman
kedua di `*.pages.dev` sementara `goxpert.my` kekal lama — dua versi,
dua tempat, dan domain masih perlu dipindahkan selepas itu.

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
| `img/` (root) | logo, pasangan thermal, bumbung + drone, surveyor + sijil SIRIM, 5 gambar re-inspection |
| `img/sticker/` | 7 sticker penanda defect (PNG latar telus) |
| `img/tool/` | 8 gambar alat berlatar telus (WebP) |
| `img/review/` | 9 review pelanggan |
| `img/report/` | 5 muka surat sample report |
| `img/dms/` | 7 paparan sistem pengurusan defect |
| `img/poster/` | poster landing page (popup) |
| `files/` | `sample-report.pdf` + `goxpert-chorus.mp3` (disalin ke `dist/files/`) |
| `img/t/` | thumbnail 560px untuk grid — dijana automatik, jangan edit |

**Prestasi:** gambar penuh dihadkan 900px (JPEG q72) untuk lightbox &
kepala page. Grid (kad projek, galeri, kad servis, kad blog) guna
thumbnail `img/t/...` (560px, ±45 KB) — kira-kira 55% lebih ringan.
Semua gambar grid `loading="lazy"`, dan slideshow servis hanya muat
slaid semasa + satu berikutnya. Kalau thumbnail hilang, gambar penuh
digunakan automatik.

> **Semua gambar kini dalam folder `img/` — tiada hosting luar langsung.**
> Hosting lama `arleta.site` sudah mati dan tiada apa-apa lagi bergantung
> padanya.

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

## Menerbitkan dari sesi Claude: apa yang tidak berfungsi

Wrangler memuat naik aset dalam dua langkah. Langkah pertama meminta
sesi muat naik dan menerima **JWT**; langkah kedua menghantar fail
dengan JWT itu dalam header `Authorization`.

Sesi Claude awan menyuntik kunci API tersimpan ke dalam setiap
permintaan ke `api.cloudflare.com`, **menulis ganti** header itu. Jadi
langkah kedua tiba di Cloudflare membawa kunci API di tempat yang
sepatutnya ada JWT, dan dijawab `401 Unauthorized`.

Disahkan: `/workers/scripts` → 200, `/assets-upload-session` → 200 (JWT
diterima), `/workers/assets/upload` → 401.

Jadi penerbitan dijalankan **di komputer pemilik**, bukan dari sesi
Claude. `npx wrangler deploy` di sana menggunakan OAuth pelayar dan
tiada proxy di tengah. Token API tidak diperlukan langsung.

Uploader dalam dashboard Cloudflare juga tidak memadai: ia menyatakan
sendiri ia hanya menyokong HTML, CSS dan JS, sedangkan laman ini ada
390 gambar, satu MP3 dan satu PDF. Ia menerima seretan, mengira 468
fail dengan saiz yang betul, mencipta versi baru — tetapi versi itu
mengandungi aset lama. Diuji dua kali, 9 November 2026.

## Google Analytics

`CONFIG.ga` memegang Measurement ID GA4 (`G-…`). `build.js` menyuntik
tag gtag ke dalam `<head>` setiap page hanya apabila baris itu ada isi;
kosongkan dan laman berjalan tanpa penjejakan, tanpa perubahan lain.

ID ini bukan rahsia — ia terpapar dalam sumber setiap page yang
menggunakannya, jadi ia tinggal dalam fail sumber seperti tetapan biasa.

Google menawarkan bekas **Google Tag Manager** (`GTM-…`) semasa pemasangan.
Ia tidak digunakan di sini. GTM ialah lapisan tambahan dengan tetapannya
sendiri; jika tetapan itu salah, data berhenti sampai tanpa sebarang
tanda. Tag gtag terus lebih mudah disahkan.

### Klik WhatsApp

Laman ini tiada troli dan tiada borang tempahan, jadi bilangan pelawat
tidak memberitahu apa-apa tentang perniagaan. Yang bermakna ialah berapa
ramai menekan WhatsApp. Klik itu dihantar sebagai acara `whatsapp_click`
dengan `page_path` dan `link_text`, supaya pemilik nampak page mana yang
benar-benar menghasilkan lead.

Diuji 9 November 2026: tag dimuat pada kesemua 69 fail HTML, dan satu
klik pada butang WhatsApp merekod
`["event","whatsapp_click",{"page_path":"/","link_text":"Get a Free Quote"}]`.

## Waktu operasi dan kawasan liputan

Waktu operasi ialah **Isnin hingga Sabtu, 9:00 pagi hingga 5:30 petang,
Ahad tutup**. Angka ini muncul di tiga tempat dan ketiga-tiganya mesti
sepadan: teks hubungi dalam EN, teks hubungi dalam BM, dan
`openingHoursSpecification` dalam JSON-LD. Yang ketiga itu yang Google
papar dalam hasil carian, jadi kesilapan di situ bermakna pelanggan
diberitahu waktu yang salah.

Kawasan liputan ialah **Johor, Melaka, Negeri Sembilan dan Selangor**,
semua bandar dalam negeri tersebut, dan tempat lain di Malaysia atas
permintaan. Johor disenaraikan dahulu kerana itu kawasan utama.

Nama bandar ditulis penuh dalam HTML dan dalam `AREA_SERVED` di
`build.js`, bukan dijana oleh JavaScript. Sebabnya: orang mencari
"building inspection Johor Bahru", bukan "building inspection Malaysia".
Tanpa nama bandar sebagai teks dan sebagai data berstruktur, laman ini
tidak muncul untuk carian begitu.

`AREA_SERVED` dikongsi oleh ORG dan oleh setiap page servis. Dahulu
senarai yang sama ditulis dua kali di `build.js`; pasti satu daripadanya
akan terlupa dikemas kini apabila liputan berubah.

## Popup WhatsApp

Setiap pautan WhatsApp di laman ini membuka popup dahulu, bukan terus
melompat ke WhatsApp. Popup itu memberi dua jalan: butang **Buka
WhatsApp**, dan nombor telefon sebagai teks yang boleh disalin.

### Kenapa

TikTok, Instagram dan Facebook membuka pautan dalam pelayar kecil mereka
sendiri. Pelayar itu selalunya tidak dibenarkan melompat keluar ke
aplikasi lain, jadi butang WhatsApp ditekan dan **tiada apa berlaku** —
tiada ralat, tiada tanda. Pelanggan menyangka butang rosak lalu tutup.
Pemilik mengesahkan ini berlaku dari TikTok.

Ini tidak kelihatan dalam Analytics: `whatsapp_click` tetap direkod,
kerana klik memang berlaku. Yang gagal ialah lompatan selepas itu.

### Apa yang dicuba dahulu, dan kenapa ia gagal

Percubaan pertama ialah mengesan pelayar dalam-app daripada tandatangan
pelayarnya, lalu memaparkan jalur amaran. Ia **tidak berfungsi**: TikTok
pada telefon pemilik tidak menghantar tandatangan yang dijangka, jadi
jalur itu tidak pernah muncul di tempat ia paling diperlukan.

Popup tidak mengesan apa-apa, jadi ia tidak boleh tersalah teka. Nombor
telefon sentiasa ada di situ, sama ada WhatsApp terbuka atau tidak.

Harganya satu ketukan tambahan untuk semua orang. Itu diterima, kerana
ketukan yang tidak membawa ke mana-mana lebih mahal.

### Nota pelaksanaan

- Pendengar dipasang **sekali** pada `document` dan diingat dengan
  pemboleh ubah JS, bukan atribut DOM. `build.js` menyimpan DOM yang
  sudah dirender; penanda dalam DOM akan terbakar ke dalam fail terbitan
  dan pendengar tidak akan dipasang pada laman sebenar.
- `[hidden]` sahaja tidak cukup untuk menyembunyikan popup: ia memberi
  `display:none` daripada pelayar, dan mana-mana peraturan CSS dengan
  `display` akan mengatasinya. `.wam[hidden] { display: none !important }`
  yang melakukannya. Kesilapan ini pernah berlaku di sini, dan sebuah
  jalur kosong muncul kepada setiap pelawat di setiap page.
- Ujian memeriksa **tinggi sebenar elemen pada skrin**, bukan sifat
  `.hidden`. Ujian yang memeriksa sifat itu lulus walaupun elemen masih
  kelihatan — itulah yang melepaskan pepijat di atas.
- Butang "Buka WhatsApp" di dalam popup dilangkau oleh penjejak
  `whatsapp_click`. Tanpa itu, setiap lead dikira dua kali.
- Pautan `wa.me` asal dibawa masuk ke dalam popup sepenuhnya, termasuk
  teks mesej yang sudah disediakan untuk page itu.

Diuji 9 November 2026 pada tujuh page, EN dan BM: popup tertutup semasa
muat (0px), terbuka pada ketukan, tertutup dengan butang silang, teks
mengikut bahasa page, pautan dalam popup sama dengan pautan asal, tiada
acara Analytics berganda, tiada ralat JavaScript.

## Alamat ikut bahasa

Alamat sepadan dengan bahasa page: perkataan English di sisi English,
perkataan Melayu di sisi Melayu.

| Page | English | Melayu |
|---|---|---|
| Landing pemilik rumah | `/homeowners/` | `/ms/pemilik-rumah/` |
| Tempahan berkelompok | `/group-booking/` | `/ms/inspection-berkelompok/` |

Semua page lain memakai slug yang sama dalam dua bahasa, dibezakan oleh
awalan `/ms` sahaja.

Dalam `build.js`, medan `outEn` pada entri PAGES memberi slug English;
`out` ialah slug Melayu dan juga lalai. Pembantu `outFor(lang, P)`
dipakai di setiap tempat alamat dibina — shell, hreflang, breadcrumb,
sitemap dan direktori keluaran — supaya tiada satu pun tertinggal.

### Alias

Slug Melayu di sisi English (`/pemilik-rumah/`, `/inspection-berkelompok/`)
dahulunya alamat sebenar dan sudah dihantar kepada Google. Ia kekal
dibina sebagai salinan yang boleh dibuka, dengan `canonical` menunjuk ke
alamat baharu, dan **tidak** dimasukkan ke dalam sitemap. Jadi pautan
lama tidak mati dan Google tahu mana yang rasmi.

Worker ini melayan fail statik sahaja tanpa kod, jadi pengalihan (301)
tidak tersedia. Salinan dengan canonical ialah cara yang ada.

### Tiga tempat yang mesti seiring

Menukar slug sebuah page bermakna menyentuh ketiga-tiga ini bersama:

1. `outEn` dalam PAGES (`build.js`) — menentukan fail dan alamat.
2. `realLinks()` (`build.js`) — menukar `href="#/..."` dalam HTML statik.
3. `SLUG_EN` / `SLUG_BM` (`index.html`) — dipakai oleh `url()` untuk
   membina pautan, dan oleh `otherLangUrl()` untuk butang bahasa.

Nombor 3 yang paling senang terlepas. Tanpanya, butang bahasa dari
`/homeowners/` menghantar pelawat ke `/ms/homeowners/` — alamat yang
tidak wujud.

Routing hash menerima kedua-dua slug, jadi `#/pemilik-rumah` dan
`#/homeowners` sama-sama membuka page yang betul.

Diuji 9 November 2026: 1,683 pautan dalaman merentas 70 fail diperiksa,
tiada satu pun pecah; butang bahasa dari setiap page mendarat pada
alamat yang wujud; hreflang berpasangan betul; sitemap mengandungi empat
alamat sebenar dan tiada alias.

## Laporan contoh: diminta, bukan dimuat turun

Butang laporan contoh dahulunya memaut terus ke
`files/sample-report.pdf`. Kini ia membuka WhatsApp dengan mesej yang
sudah ditulis, dalam bahasa page itu.

Sebabnya: muat turun terus tidak meninggalkan apa-apa. Pemilik tidak
tahu siapa yang mengambilnya, dan tiada perbualan bermula. Permintaan
melalui WhatsApp menukar pelawat tanpa nama menjadi mesej yang boleh
dibalas.

Fail PDF **tidak diterbitkan**. `build.js` membuangnya daripada `dist/`
selepas menyalin folder `files/`, kerana meninggalkannya pada alamat
yang boleh diteka akan memintas permintaan itu sepenuhnya. Fail asal
kekal dalam repo.

### Untuk memulihkan muat turun terus

1. Buang baris `fs.rmSync(... "sample-report.pdf" ...)` dalam `build.js`.
2. Kembalikan medan `pdf: "files/sample-report.pdf"` dalam objek `ex`
   (`CONFIG` servis), dan jadikan butang `.rep-cta` bersyarat padanya
   semula.
3. Tukar `repBtn` dan `lp.sample` kembali kepada teks muat turun.

Tiga tempat, dan ketiga-tiganya mesti seiring.

Diuji 13 November 2026: tiada pautan `sample-report` tinggal dalam
mana-mana daripada 71 fail HTML; PDF tiada dalam `dist/files/`; butang
di landing page dan di page servis membuka popup WhatsApp dengan mesej
dalam bahasa yang betul; tiada ralat JavaScript.

## Kelayakan: apa yang laman ini boleh dan tidak boleh dakwa

Laman ini pernah mendakwa, di 22 tempat, bahawa **setiap inspector ialah
Registered Building Surveyor berdaftar RISM**. Itu tidak tepat, dan
pemilik membetulkannya pada 13 November 2026.

Yang betul:

- Inspector memiliki **ijazah dalam Building Surveying**.
- Mereka **Graduate Member RISM**. Graduate Member ialah gred keahlian
  Royal Institution of Surveyors Malaysia — ia **bukan** pendaftaran.
- **Registered Building Surveyor** ialah gelaran berdaftar yang
  berasingan. Firma ini **bekerjasama dengan** mereka; ia bukan
  kelayakan firma sendiri.
- Laporan yang disediakan dengan kerjasama RBS: **Building Condition
  Assessment** dan **dilapidation survey** sahaja.

### Kenapa ini penting lebih daripada ayat biasa

"Registered Building Surveyor" ialah gelaran berdaftar di Malaysia, dan
laporan firma ini masuk ke Tribunal Tuntutan Pembeli Rumah. Pihak lawan
memang memeriksa kelayakan. Dakwaan yang melebihi kenyataan bukan
sekadar salah tulis — ia boleh meruntuhkan laporan di dalam prosiding.

Dakwaan itu juga berada dalam JSON-LD sebagai `hasCredential`, yang
Google baca sebagai pernyataan kelayakan rasmi, dan dalam `llms.txt`,
yang pembantu AI baca dan ulang.

### Sebelum menukar apa-apa ayat kelayakan

Dakwaan ini tersebar jauh daripada satu baris. Semak kesemuanya:

```
badge hero (EN/BM)        chip pada 5 kad page servis
badge landing (EN/BM)     teks artikel blog (EN/BM)
chip hero.t2 (EN/BM)      soalan FAQ (EN/BM)
perenggan hero (EN/BM)    meta description (index.html + PAGES)
kad "kenapa kami"         ORG description (build.js)
senarai VALUES            hasCredential (JSON-LD)
                          llms.txt
```

Cara memeriksa yang masih tinggal:

```
grep -rn "RISM-[Rr]egistered\|RISM registered\|berdaftar RISM\|\
Berdaftar RISM\|registered under the Royal\|Registered with the Royal" \
  index.html build.js dist
```

Harus pulangkan sifar.

Diuji 13 November 2026: sifar padanan dalam `index.html`, `build.js` dan
kesemua 71 fail terbitan; teks BM muncul pada page BM dan teks EN pada
page EN; FAQPage JSON-LD membawa `inLanguage` yang betul untuk
kedua-duanya; tiada overflow, tiada ralat JavaScript.

## Pakej terbit untuk pemilik (`website/deploy/`)

Pemilik menerbitkan laman dari komputernya sendiri, bukan dari sesi
Claude — lihat bahagian "Menerbitkan dari sesi Claude: apa yang tidak
berfungsi" di atas.

Pakej yang dihantar kepadanya ialah `dist/`, `wrangler.jsonc`, dan
kedua-dua fail dalam folder ini:

- `DEPLOY.bat` — menjalankan `npx wrangler deploy` dan melaporkan
  hasilnya.
- `BACA-DULU.txt` — arahan dan senarai ralat biasa, dalam BM.

Kedua-duanya disimpan di sini supaya ia dijejak bersama kod. Versi
pertama hanya wujud dalam skrip pembungkusan, dan akibatnya pepijat di
bawah tidak kelihatan sehingga pemilik melaporkannya.

### Pepijat yang pernah ada di sini

`DEPLOY.bat` versi pertama mencetak "Selesai. Semak goxpert.my" tanpa
memeriksa kod keluar `wrangler`. Apabila deploy gagal kerana masa tamat
rangkaian, skrip tetap mengucapkan selesai. Pemilik menutup tetingkap
itu dengan yakin laman sudah berubah, sedangkan ia tidak.

Versi sekarang membaca `ERRORLEVEL` dan mencetak **BERJAYA** atau
**GAGAL**, dan pada kegagalan ia menerangkan maksud tiga ralat yang
paling biasa.

Skrip yang melaporkan kejayaan tanpa memeriksanya lebih buruk daripada
tiada skrip: ia memindahkan kesilapan ke tempat yang lebih sukar
dikesan.
