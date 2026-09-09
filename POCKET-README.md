# GoXpert Pocket — Nota Projek (fail: `pocket_index_88.html`)

Rujukan lengkap untuk aplikasi **GoXpert Pocket — Surveyor's AI Companion** (versi 88).
Ia aplikasi **berasingan** daripada Go Inspect (`index.html`) tetapi **berkongsi projek
Firebase yang sama** (`go-inspect---home-owner`). Dokumen ini merekod apa yang ada di dalam
fail itu, model datanya, dan isu yang perlu diselesaikan sebelum publish.

- Fail: `pocket_index_88.html` — 591 KB, 16,122 baris, **single-file** (HTML + CSS + JS dalam
  satu fail, tiada build step). Buka terus dalam browser atau deploy sebagai static hosting.
- Sasaran peranti: **telefon** (viewport dikunci, `user-scalable=no`, safe-area inset, bottom nav).
- Tema: light/dark penuh melalui CSS variables pada `:root[data-theme]`.

---

## 1. Senibina ringkas

| Lapisan | Butiran |
|---|---|
| UI | Vanilla JS + DOM, tiada framework. Semua skrin ialah `<main>`/overlay yang di-toggle dengan class `.show` |
| Auth | Firebase Auth (email + password) |
| Data | Firestore sahaja — **tiada Cloud Storage digunakan** walaupun SDK storage dimuatkan |
| AI | Google Gemini REST (`generativelanguage.googleapis.com/v1beta`), default model `gemini-2.5-flash` |
| PDF | jsPDF 2.5.1 (client-side) |

### Dependency luar

| Library | Cara muat | Guna untuk |
|---|---|---|
| Firebase 10.7.1 compat (app, auth, firestore, storage) | `<script>` dalam `<head>` | auth + firestore. **storage-compat tidak pernah dipanggil** — boleh buang |
| jsPDF 2.5.1 (cdnjs) | `<script>` dalam `<head>` | export laporan PDF |
| three.js r128 (cdnjs) | lazy `loadThree()` | AR Measurement + AR Floor Plan (WebXR) |
| fabric.js 5.3.0 (cdnjs) | lazy `loadFabric()` | Plan Editor (lukisan 2D) |
| Google Fonts (Newsreader, Inter Tight, IBM Plex Mono) | `<link>` | tipografi |

API browser yang diperlukan: `navigator.xr` (AR), `DeviceOrientationEvent` (spirit level,
compass), `navigator.geolocation` (GPS tag), `webkitSpeechRecognition` + `SpeechSynthesisUtterance`
(voice mode, translator), `navigator.vibrate` (haptic).

---

## 2. Model data Firestore

Semua data Pocket di-scope bawah **UID pengguna**.

```
pocketInspections/{uid}/inspections/{inspId}
    title, status ('active'|'completed'), createdAt, updatedAt,
    projectInfo{}, photoCount, coverPhoto (base64),
    barisCounts { good, fair, dilapidated }

pocketInspections/{uid}/inspections/{inspId}/photos/{photoId}
    image (base64 dataURL), location, remarks, gps{},
    condition (1-5), priority (1-4), baris (skor), defectType,
    timestamp, aiStatus ('processing'|'done'|'failed'), aiAnalysis{}

pocketChats/{uid}/conversations/{convId}
    title, createdAt, updatedAt, lastMessage, messageCount

pocketChats/{uid}/conversations/{convId}/messages/{msgId}
    role ('user'|'assistant'), content, image?, mode, timestamp

siteSessions/{uid}/sessions/{sessionId}      (arkib sesi site mode)

users/{uid}   ← ditulis masa signup: { name, email, pocketUser: true, createdAt }

settings/pocketConfig   (dibaca app)   enabled, featureChat, featureVoice,
                                       featureConsultantMode, model,
                                       systemPromptNormal, systemPromptConsultant
settings/ayieConfig     (dibaca app)   apiKey, model   ← dikongsi dengan Go Inspect
```

### localStorage

| Kunci | Isi |
|---|---|
| `pocket_theme` | `light` / `dark` |
| `pocket_mode` | `normal` / `consultant` |
| `pocket_site_session` | sesi site mode penuh **termasuk gambar base64** |
| `pocket_active_inspection_id` | inspection yang aktif untuk Site Mode |

---

## 3. Peta skrin

**Bottom nav 4 tab** + Chat (dibuka dari kad/FAB) + Site Mode (fullscreen overlay).

1. **Home** — stat strip, kad "Ongoing" (inspection aktif), senarai Inspections, Recent Activity, kad Ask.
2. **Tools** — 12 alat, dikategorikan (assess / orient / measure / ai / draw / talk / calc).
3. **Library** — rujukan tempatan (`const LIBRARY`): `defects`, `standards`, `legal`, `methodology`.
   Ada carian, senarai kategori, dan paparan detail. Kandungan hardcoded, boleh dikembangkan.
4. **Profile** — nama/email, toggle tema, toggle Consultant mode, clear chat, sign out.

**Chat mode** — multi-conversation dengan sidebar, rename/delete, auto-generate tajuk, sokongan
lampiran gambar (resize 1024px), starter prompts, dan render markdown ringkas.

**Voice mode** — orb + tekan-untuk-cakap. Toggle bahasa **BM (`ms-MY`) ⇄ EN (`en-US`)**.
Jawapan dihadkan bawah 3 ayat dan dibaca guna TTS.

**Site Mode** — skrin lapangan: pilih inspection aktif → Capture foto → auto tag GPS →
klasifikasi AI → kemas kini matriks BARIS → simpan ke inspection.

---

## 4. Dua mod AI

`getSystemPrompt()` memilih antara dua system prompt (boleh di-override dari `settings/pocketConfig`):

| Mod | Temperature | Max tokens | Gaya |
|---|---|---|---|
| Normal | 0.5 | 2048 | jawapan pantas, perbualan |
| Consultant | 0.3 | 4096 | berstruktur, report-grade, rujuk standard |
| Voice (mana-mana mod) | — | 512 | ≤3 ayat, tiada markdown |

Semua `safetySettings` diset `BLOCK_NONE`.

### Aliran AI dalam app

1. **Chat** — teks + gambar → Gemini.
2. **Voice** — speech-to-text → Gemini → text-to-speech.
3. **Auto-classify** (`triggerAIClassify`) — setiap foto capture dihantar dengan prompt
   berformat tetap; jawapan di-parse oleh `parseAIAnalysis()` untuk medan
   `DEFECT / TYPE / CONDITION / PRIORITY / CAUSES / STANDARDS / WRITEUP`.
4. **BARIS AI Suggest** — cadangan condition + priority sahaja, untuk satu foto.
5. **Sketch to Real** — lakaran pelan lantai → Gemini → SVG dibersihkan → PNG.
6. **Voice Translator** — Speech API + Gemini + TTS.

---

## 5. Matriks BARIS

Skor = **Condition (1-5) × Priority (1-4)**.

| Condition | Maksud | | Priority | Maksud |
|---|---|---|---|---|
| 1 | New/As New — minor servicing | | 1 (N1) | Normal — kosmetik |
| 2 | Fair — minor repair | | 2 (R2) | Routine — boleh jadi teruk |
| 3 | Poor — major repair | | 3 (U3) | Urgent — tak berfungsi elok |
| 4 | Very Poor — malfunction | | 4 (E4) | Emergency — risiko kecederaan |
| 5 | Dilapidated — damage/missing | | | |

| Skor | Rating | Tindakan |
|---|---|---|
| 1–4 | Good (hijau) | Plan Maintenance |
| 5–12 | Fair (kuning) | Condition Monitoring |
| 13–20 | Dilapidated (merah) | Serious Attention |

Skema lama **B0–B4** masih disokong: `migrateBLevel()` memetakannya ke pasangan
condition+priority, dan `normalizeBarisCounts()` menerima kedua-dua format kiraan.

---

## 6. 12 alat (Tools tab)

| Alat | Teknologi | Nota |
|---|---|---|
| BARIS Rater | — | kalkulator matriks + butang "Ask Pocket" |
| Defect Scan | Gemini vision | ambil/upload foto → analisis |
| Spirit Level | DeviceOrientation | perlu permission iOS |
| Compass | DeviceOrientation | tunjuk darjah + arah mata angin |
| Crack Ruler | Canvas 2D | zoom/pan/pinch, kalibrasi rujukan, klasifikasi lebar retak |
| AR Measurement | WebXR + three.js | hit-test, ukur jarak |
| AR Floor Plan | WebXR + three.js | tindih pelan pada lantai sebenar |
| Sketch to Real | Gemini | lakaran → pelan SVG kemas |
| Plan Editor | fabric.js | lukisan 2D, eksport PNG |
| Voice Translator | Speech API + Gemini | terjemah + sebut |
| Converter & Calculator | — | unit + kalkulator |
| Tally Counter | — | kiraan pantas di tapak |

---

## 7. Export PDF

`generatePDF()` menggunakan jsPDF: saiz A4, **4 penemuan setiap muka surat** (grid kuadran).
Pengguna masuk **selection mode** dahulu (pilih foto / "All"), kemudian generate. Gambar
di-resize semula (`resizeImageForPdf`, JPEG q0.78) sebelum dimasukkan supaya fail tak membesar.

---

## 8. Isu yang perlu dibetulkan sebelum publish

Disusun ikut keutamaan. Semua disahkan dengan membaca `pocket_index_88.html` dan
`firestore.rules` dalam repo ini.

### P1 [CRITICAL — keselamatan] Data Pocket terdedah kepada umum

`firestore.rules` masih membiarkan koleksi Pocket terbuka sepenuhnya:

```
match /pocketChats/{p=**}       { allow read, write: if true; }
match /pocketInspections/{p=**} { allow read, write: if true; }
match /siteSessions/{p=**}      { allow read, write: if true; }
```

Sesiapa sahaja (tanpa login) boleh baca/tulis/padam semua inspection, foto, dan chat semua
pengguna. Oleh sebab semua path Pocket sudah ber-scope UID, rules ketat ini memadai dan
**tidak** memecahkan app:

```
match /pocketInspections/{uid}/{p=**} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
match /pocketChats/{uid}/{p=**} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
match /siteSessions/{uid}/{p=**} {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
```

### P2 [HIGH] `settings/pocketConfig` tak boleh dibaca pengguna biasa

App membaca `settings/pocketConfig`, tetapi rules hanya membenarkan signed-in read untuk
`ayieConfig`, `ayieTalkConfig`, `appLinks`, `voiceCorrections`. Doc lain jatuh pada wildcard
`match /settings/{doc} { allow read, write: if isAdmin(); }` — jadi **admin sahaja**.

Kesan: `loadConfig()` menangkap error itu secara senyap dan guna default. Maka **maintenance
switch (`enabled: false`), feature flags, pilihan model, dan system prompt custom tidak
pernah berkuat kuasa** untuk pengguna biasa. Fix: tambah baris

```
match /settings/pocketConfig { allow read: if isSignedIn(); allow write: if isAdmin(); }
```

### P3 [HIGH] Signup tulis `users/{uid}`, rules jangka `users/{email}`

Pocket menulis `db.collection('users').doc(cred.user.uid)`, tetapi rules Go Inspect memadan
`match /users/{email}` dengan syarat `email == myEmail()`. Dokumen ber-ID UID gagal syarat itu
→ **permission denied**. Akaun tetap tercipta, tetapi tulisan profil gagal dan mesej ralat
Firebase muncul pada borang signup. Pilih satu: tukar Pocket kepada `doc(email.toLowerCase())`
supaya konsisten dengan Go Inspect, atau tambah rule khusus untuk doc ber-ID UID.

### P4 [HIGH — kos + prestasi] `updateInspectionCounts()` baca semula semua foto

Setiap kali satu foto disimpan, fungsi ini melakukan `.collection('photos').get()` penuh —
memuat turun **semua** foto base64 dalam inspection itu semata-mata untuk mengira BARIS dan
memilih cover. Inspection 100 foto = ratusan MB bandwidth dan 100 document read bagi
**setiap** capture. Fix: kemas kini kiraan secara incremental (`FieldValue.increment`) dan set
`coverPhoto` sekali sahaja pada foto pertama.

### P5 [MED] Foto base64 di dalam dokumen Firestore

Foto disimpan sebagai dataURL dalam dokumen (`resizeImage(file, 1200)`, JPEG q0.85). Had saiz
dokumen Firestore ialah **1 MiB**, dan base64 menambah ~33%. Foto padat/berbutir boleh
melebihi had dan gagal simpan. SDK Cloud Storage sudah dimuatkan tetapi tidak digunakan —
memindahkan foto ke Storage menyelesaikan P4 dan P5 sekali gus.

### P6 [MED] `pocket_site_session` menyimpan base64 dalam localStorage

`persistSession()` menulis sesi penuh termasuk gambar ke localStorage (had biasa 5–10 MB).
Bila penuh ia hanya `console.warn` — pengguna tidak diberitahu kerja tak tersimpan.

### P7 [LOW] Kunci API Gemini dihantar ke client

`getApiKey()` mengambil `ayieConfig.apiKey` dan memasukkannya ke dalam URL request dari
browser. Ini keputusan Phase 1 sedia ada yang didokumenkan dalam `firestore.rules`, dan Pocket
mewarisinya. Penyelesaian sama: proxy panggilan AI melalui Cloud Function.

### P8 [LOW] Pembersihan kecil

- `firebase-storage-compat.js` dimuatkan tetapi tiada `firebase.storage()` dipanggil.
- `safetySettings` semuanya `BLOCK_NONE`.
- ID elemen berulang (`crCanvas`, `lvlDeg`, `sensorCloseBtn`, `inspExportBtn`) — semuanya
  dalam template string keadaan berlainan, jadi tak pernah wujud serentak. Bukan bug, cuma
  perlu berhati-hati bila edit.

---

## 9. Deploy

`firebase.json` sekarang hanya mendaftar firestore rules, storage rules, dan functions —
**tiada blok `hosting`**. Untuk hosting Pocket, tambah konfigurasi hosting dan tentukan fail
mana yang jadi `index.html` bagi laman itu, atau serve `pocket_index_88.html` dari mana-mana
static host. Selepas menukar `firestore.rules`, deploy dengan:

```
firebase deploy --only firestore:rules
```

Uji dahulu dalam Rules Playground seperti prosedur yang sudah didokumenkan di kepala
`firestore.rules`.
