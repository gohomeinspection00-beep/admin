# Phase 5 — Buang password plaintext (login guna Firebase Auth sahaja)

## Apa ini
Selepas ini, password TIDAK lagi disimpan dalam Firestore. Login guna Firebase Auth
(yang simpan password dalam bentuk hash — selamat). Admin TIDAK boleh nampak password
lagi — hanya RESET (set password baru & beritahu user).

## Yang berubah dalam admin
- Cipta user / edit user / cipta admin / edit admin: password TIDAK ditulis ke Firestore;
  ia hanya diset dalam Firebase Auth (melalui Cloud Function). Kalau set Auth gagal,
  admin dapat AMARAN (supaya user tak terkunci).
- Lajur/paparan "Password" dalam senarai user dibuang (admin tak nampak password lagi).
- Bonus: tukar password admin kini betul-betul berkesan untuk login (dulu ada bug).

## Deploy (mudah — admin sahaja, tiada Cloud Shell)

### 1. Deploy admin panel baru
Deploy `admin_panel.html` baru ke site admin (Netlify).

### 2. Pastikan Auth lengkap DAHULU (penting — elak terkunci)
- Log masuk admin sebagai **super-admin** (team.gohomeinspection@gmail.com).
- Pergi **Settings / Database Maintenance**.
- Klik **"Selaras Password (Auth)"** sekali lagi → tunggu laporan
  (`dikemaskini X, dilangkau Y`). Ini pastikan SEMUA user ada password Auth yang betul
  sebelum kita buang plaintext.
  - Kalau ada user "dilangkau" (password kosong/&lt;6 aksara): buka user itu, set password
    yang sah (&ge;6 aksara), kemudian klik "Selaras Password (Auth)" semula.

### 3. Buang plaintext
- Klik butang merah **"Buang Password Plaintext"** → sahkan.
- Ia akan padam field `password` dari semua dokumen `users` + `admins`.
- Laporan: `X password plaintext dibuang`.

### 4. Uji (pastikan tiada apa pecah)
- **Login user biasa** (akaun sedia ada) → masih boleh masuk. ✓
- **Cipta user baru** di admin → user baru boleh login. ✓
- **Edit/reset password** seorang user → user login dengan password baru. ✓

## Cara uruskan user lupa password (selepas ini)
User PM admin → admin buka user → **Edit** → taip password baru → Simpan
→ beritahu user password baru. (Auth dikemaskini automatik.)

## Selamat & boleh balik?
- Login TIDAK terjejas — ia guna Firebase Auth, bukan field Firestore.
- Migrasi cuma padam SATU field (`password`), bukan dokumen. Idempotent (boleh ulang).
- Kalau perlu (jarang): Auth masih ada semua password (langkah 2), jadi tiada sesiapa
  terkunci. Tiada cara untuk "pulihkan" plaintext lama (itu memang tujuannya) — guna
  reset.

## Nota
- Tiada perubahan pada `index.html` (app), Cloud Functions, atau security rules untuk
  Phase 5. Hanya `admin_panel.html`.
