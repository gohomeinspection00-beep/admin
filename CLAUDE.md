# GoXpert / Go Home Inspection — Sistem Notis Tuntutan Kecacatan

Repo ini menjana surat rasmi **Notis 1 (First Notice)** dan **Notis 2 / Notis Akhir (Final Notice)** tuntutan pembaikan kecacatan rumah kepada pemaju di Malaysia, bagi pihak pemilik rumah (client GoXpert / Go Home Inspection).

## Aliran kerja WAJIB

1. **Kumpul maklumat** — user akan upload borang/invoice client, SPA (softcopy), dan screenshot defects. Extract sendiri semua data dari dokumen (jangan minta user taip semula).
   - PDF scan (tiada text layer): render dengan `pymupdf` (`pip install pymupdf pillow`; import name `fitz`/`pymupdf`) pada dpi 100–130, kemudian baca imej dengan tool Read.
   - Dari SPA cari: nama & no. syarikat pemaju, alamat berdaftar, no. rujukan SPA, tarikh SPA, jenis jadual (G/H/I), lot/PT, jenis rumah, nama projek.
2. **Tunjukkan borang pengesahan** lengkap (jadual maklumat pemilik/pemaju/hartanah/SPA/kronologi/senarai kecacatan) dan tanya soalan yang tertinggal SEBELUM generate. Jangan generate tanpa pengesahan user.
3. **Generate PDF** dengan skrip jsPDF (lihat corak di bawah), verify kandungan secara automatik (pymupdf text assertions — normalise whitespace dulu: `re.sub(r'\s+',' ',text)`).
4. **Hantar PDF kepada user** (SendUserFile), kemudian `git add` + `commit` + `push` ke branch kerja semasa. Setiap perubahan kecil pun: regenerate → hantar → commit → push.
5. **Remarks user = keutamaan tertinggi.** Ikut arahan user walaupun berbeza dari corak biasa.

## Peraturan kandungan notis

- **Tarikh akhir = tarikh notis + 15 hari kalendar** (kecuali user minta ikut komitmen pemaju sendiri atau tarikh tamat 30 hari S&P).
- **Jangan sekali-kali guna perkataan "penipuan"** — guna framing fakta, cth. "salah nyata status pembaikan".
- Bahasa: Bahasa Melayu rasmi, istilah teknikal dwi-bahasa dalam kurungan, cth. "Keretakan pada dinding bercat (Crack on painted wall)".
- **Jenis jadual menentukan klausa:**
  - Jadual G (landed): Klausa **27(1)** pembaikan, **29(1)** serahan dokumen, DLP 24 bulan
  - Jadual H (strata): Klausa **30(1)** / **32(1)**
  - Jadual I (BTS): tiada nombor klausa — guna wording generik + Akta 118
  - SPA persendirian (bukan HDA): baca klausa Defect Liability & Notices dalam SPA itu sendiri dan petik nombor klausa sebenar (cth. Metacorp: 11.1 & 13.1)
  - Aurora Sentral / Country View: "Klausa 27 + Seksyen 12(2) Akta 118" (ikut precedent notis lama owner)
- **Struktur Notis 1:** kepala pengirim → penerima (nama pemaju BOLD + no. syarikat) → tarikh kanan → Ruj → Perkara (bold, underline) → para intro (SPA, inspection, serahan laporan, 30 hari) → para kegagalan/re-inspection → jadual Senarai Kecacatan (No./Lokasi/Kecacatan/Status) → nota kaki senarai tidak lengkap → para penekanan khas (major/keselamatan/kebocoran/alignment) → para klausa → para tuntutan 15 hari → bullets eskalasi (re-inspection, sebut harga, Notis 2, TTPR) → para serahan dokumen → Peringatan Tindakan Undang-undang → tandatangan → KRONOLOGI TINDAKAN (jadual) → 2× AKUAN TERIMA (Salinan Pemaju + Salinan Pemilik: nama/jawatan/tarikh/cop syarikat).
- **Notis 2:** rujuk no. rujukan Notis 1, nyatakan kegagalan mematuhi, senarai kecacatan terkini, tarikh akhir "TARIKH MUKTAMAD", amaran penuh (TTPR, wang tahanan 5% Klausa 27(2) Jadual G, aduan KPKT, Akta 118).
- **Bukti serahan (jika user beri gambar AR card / cop RECEIVED):** masukkan sebagai LAMPIRAN (imej ~90×160mm tengah halaman + kapsyen italic) DAN rujuk dalam perenggan 1 + kronologi (siapa terima, tarikh, no. pos daftar).
- **Dua pembeli:** header dua nama, intro "Kami, X dan Y", tandatangan sebelah-menyebelah (`sigCol2 = mL + 85`), Akuan Terima kedua-dua nama.
- **Dua alamat penerima:** parameterkan dengan `process.argv[2]` dan jana dua PDF berasingan (cth. `_SERKAM` / `_SELANGOR`).
- **Penekanan khas** selalu diminta: kecacatan major (RC terdedah, honeycomb), keselamatan elektrik (open ground, SPD, RCCB, wayar longgar/terdedah — "risiko kejutan elektrik dan kebakaran, pembaikan oleh orang kompeten"), kebocoran aktif ("kesan punca, bukan pembaikan kosmetik"), kluster wall alignment (senarai semua item + bukti ukuran), saliran (tanah merah/flushing/cerun paip), dan tuntutan "dokumen rasmi (official documentation)" jika sesuatu didakwa reka bentuk asal.
- **Nombor rujukan:** `NOTIS-1/2026/NNN` berurutan (semak nombor terakhir dengan `grep -h "noRujukan" generate-notis1-*.js`); Notis 2 guna nombor sama dengan prefix `NOTIS-2/`.

## Corak teknikal (jsPDF)

- Semua skrip: `generate-notis1-<nama>.js` / `generate-notis2-<nama>.js`, output `NOTIS_1_<NAMA>.pdf`. Jalankan dengan `node`.
- Guna corak sedia ada — **clone skrip paling hampir** (`cp`) kemudian ganti blok `const data = {...}` dan perenggan melalui python heredoc (Edit tool selalu gagal pada blok unicode em-dash; python `re` replacement lebih dipercayai).
  - Notis 1 pembeli tunggal + re-inspection: `generate-notis1-thayaaniti.js` / `generate-notis1-fatin.js` (SPA persendirian)
  - Notis 1 dua pembeli: `generate-notis1-aisyhah.js` / `generate-notis1-azrul.js`
  - Notis 2: `generate-notis2-ngu.js` (dua alamat + 2 lampiran AR), `generate-notis2-pupalan.js` (lampiran akuan terima), `generate-notis2-sukri.js`
  - Sampul label: `generate-sampul-psa.js` (kotak putus-putus DARIPADA/KEPADA, gunting & tampal)
- Layout: A4, margin kiri/kanan 25mm, `cW=160`; font Helvetica; SZ={BODY:12,SMALL:10,TABLE:10,FOOTNOTE:9,FOOTER:8,TITLE:12}; LH=6, LH_S=5; `checkBreak(n)` had `pageH-22`; `checkBreak(45)` sebelum heading Senarai; `checkBreak(60)` sebelum blok tandatangan; footer setiap muka: garis + `Ruj: <no>` kiri + `Muka X daripada Y` kanan.
- **Helvetica tiada simbol Ω/©** — tulis "ohm" dalam perkataan; jangan letak aksara istimewa dalam jadual.
- Imej bukti dari chat: recover base64 dari transcript JSONL user message images; webp/png → convert JPEG dengan PIL (`thumbnail((1400,1400))`, quality 88) sebelum `doc.addImage`.
- Word (.docx) jika diminta: pakej `docx` npm; LibreOffice/pandoc TIADA dalam environment — verify dengan `zipfile` + regex strip `word/document.xml`.
- Selepas container reset: `git fetch origin <branch> && git checkout -B <branch> origin/<branch>`, `npm install jspdf`, `pip install pymupdf pillow`.

## Nota pemaju kerap guna

| Pemaju | Alamat notis biasa | Tel |
|---|---|---|
| Parkland City Sdn Bhd (201201031906 / 1016393-K) | HQ: No. 112, Jalan Tun Perak, 75300 Melaka; Site: Bangunan Parkland Group, Persiaran Wau Kikik, Bandar Layangkasa, 81700 Pasir Gudang | HQ 06-222 2888; Layangkasa 013-665 5111 |
| UDA Land (South) Sdn. Bhd. (197501001813 / 23298-K) | JB: No. 1, Jalan Padi Mahsuri 12, Bandar Baru Uda, 81200 JB; HQ: Tingkat 15, Blok Menara, Kompleks Pertama, Jalan TAR, 50100 KL | JB 07-237 4944; HQ +603-2730 8500 |
| Country View Resources | — CC peguam K.H. Koh Azhar & Koh | 07-335 9877 / 07-223 6799 |
| Scientex Heights Sdn. Bhd. (198801002898 / 170255-V) | Sales: Persimpangan Jalan Baru Serkam, 77300 Merlimau/Mukim Jasin; Berdaftar: No. 9, Persiaran Selangor, Seksyen 15, 40200 Shah Alam | 06-251 9770; scientex-heights@scientex.com.my |
| Metacorp Properties Sdn. Bhd. (198301002311 / 97547-U) | Perniagaan: No. 42A, Jalan TU 2, Taman Tasik Utama, Ayer Keroh; Berdaftar: L5-01, Menara Kenari, TTDI, 60000 KL | — |

Nombor telefon pemaju lain: cari dengan WebSearch jika tiada dalam SPA.
