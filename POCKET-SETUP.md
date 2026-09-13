# GoXpert Pocket — Panduan Buka Projek Firebase Sendiri

Panduan ini untuk **memisahkan Pocket daripada projek Go Inspect**, supaya:

- Deploy rules Pocket tak boleh rosakkan Go Inspect.
- Bil dan kuota berasingan. Satu app tak boleh bakar duit app satu lagi.
- Pocket dapat kuota percuma sendiri.

Ikut langkah ikut turutan. Bahagian **AWAK** perlu dibuat sendiri dalam browser.
Bahagian **SAYA** akan disiapkan selepas awak hantar `firebaseConfig`.

---

## AWAK — Langkah 1: Buka projek Firebase baharu

1. Pergi ke <https://console.firebase.google.com>
2. Klik **Add project**
3. Nama projek: cadangan `goxpert-pocket`
4. Google Analytics boleh dimatikan. Tak perlu untuk app ini.
5. Tunggu sampai siap, klik **Continue**

---

## AWAK — Langkah 2: Hidupkan Authentication

1. Menu kiri, pilih **Build** > **Authentication**
2. Klik **Get started**
3. Pilih **Email/Password**
4. Hidupkan suis **Enable** yang pertama. (Yang kedua, "Email link", biar mati.)
5. Klik **Save**

---

## AWAK — Langkah 3: Buat Firestore Database

1. Menu kiri, pilih **Build** > **Firestore Database**
2. Klik **Create database**
3. Pilih lokasi: **asia-southeast1 (Singapore)**. Paling hampir dengan Malaysia, jadi app terasa laju.
4. Pilih **Start in production mode**. Jangan pilih test mode.
5. Klik **Create**

> Lokasi **tak boleh ditukar** selepas ini. Pastikan pilih Singapore.

---

## AWAK — Langkah 4: Buat Cloud Storage

1. Menu kiri, pilih **Build** > **Storage**
2. Klik **Get started**
3. Pilih **Start in production mode**
4. Lokasi ikut sama dengan Firestore tadi
5. Klik **Done**

---

## AWAK — Langkah 5: Ambil firebaseConfig

1. Klik ikon **roda gigi** di atas menu kiri, pilih **Project settings**
2. Skrol ke bawah sampai bahagian **Your apps**
3. Klik ikon **web**, iaitu simbol `</>`
4. Nickname: `GoXpert Pocket`
5. **Jangan tanda** kotak Firebase Hosting. Kita buat kemudian.
6. Klik **Register app**
7. Akan keluar satu blok kod. Salin bahagian ini sahaja:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

8. **Hantar blok itu kepada saya.**

> Config ini bukan rahsia. Ia memang dihantar ke setiap browser yang buka app.
> Yang menjaga data awak ialah rules, bukan config.

---

## AWAK — Langkah 6: Pasang jaring keselamatan bil

Jangan langkau bahagian ini.

1. Dalam Firebase Console, klik roda gigi > **Usage and billing**
2. Buka tab **Details & settings**
3. Set **budget alert**, cadangan mula dengan amaun kecil dahulu

Ini yang akan beritahu awak awal kalau ada bug membakar kuota, sebelum ia jadi bil besar.

---

## SAYA — Yang akan saya siapkan lepas terima config

1. Tukar `firebaseConfig` dalam fail app kepada projek baharu awak.
2. Deploy rules baharu yang dah siap dalam folder `pocket/`:
   - `pocket/firestore.rules` — setiap pengguna nampak data sendiri sahaja
   - `pocket/storage.rules` — foto, model 3D, video endoscope
3. Tukar simpanan foto dari base64 dalam Firestore kepada Cloud Storage.
   Ini membetulkan had 1 MiB dan kos baca berulang.
4. Tambah butang import galeri, iaitu pintu masuk untuk gambar endoscope dan
   fail pelan lantai.

---

## Perkara yang akan berubah untuk pengguna

- **Kena daftar akaun semula.** Projek baharu bermakna senarai pengguna baharu.
  Login lama tak jalan.
- **Data Pocket lama tak ikut.** Sudah disahkan tiada data penting.
- Go Inspect **tak terjejas langsung**. Ia kekal pada projek asalnya.

---

## Nota deploy (kemudian)

Fail dalam `pocket/` ialah konfigurasi untuk projek Pocket, berasingan daripada
fail Go Inspect di root repo ini. Untuk deploy, jalankan perintah dari **dalam
folder `pocket/`**, bukan dari root:

```
cd pocket
firebase use <project-id-pocket-awak>
firebase deploy --only firestore:rules,storage
```

Untuk hosting, salin fail app ke `pocket/public/index.html` dahulu, kemudian:

```
firebase deploy --only hosting
```
