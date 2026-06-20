# Phase 4 — Sembunyikan AI keys di belakang proxy Cloud Function

## Kenapa
Sebelum ni, sesiapa yang log masuk boleh baca API key AI (Gemini / TTS) dari Firestore
`settings/ayieConfig`. Phase 4 alihkan semua panggilan AI ke 2 Cloud Function proxy
(`aiGenerate`, `ttsSynthesize`) yang simpan key di server. App hantar permintaan ke proxy,
proxy tambah key dan pulang jawapan Google sama persis. Key tak lagi terdedah ke browser.

## Susunan deploy — IKUT URUTAN INI (penting)

Setiap langkah selamat & boleh balik. JANGAN langkau atau tukar urutan — terutama
JANGAN simpan AI settings di admin (Langkah 4) sebelum app guna proxy (Langkah 3).

### Langkah 1 — Deploy 2 Cloud Function baru (Google Cloud Shell)
Sama macam dulu (reconcile password). Guna fail `goinspect-functions-phase4.zip`.

1. Buka https://console.cloud.google.com → pilih projek **go-inspect---home-owner** →
   klik ikon **Cloud Shell** (terminal di atas).
2. Klik **⋮ (3 titik) → Upload** → pilih `goinspect-functions-phase4.zip`.
3. Dalam terminal, jalankan satu-satu:
   ```bash
   unzip -o goinspect-functions-phase4.zip -d goinspect-fn
   cd goinspect-fn/functions
   npm install
   cd ..
   firebase use go-inspect---home-owner
   firebase deploy --only functions
   ```
4. Tunggu "Deploy complete!". Patut nampak 4 function sekarang:
   `reconcileAuthPassword`, `reconcileAllPasswords`, **`aiGenerate`**, **`ttsSynthesize`**.

> Jika ada error kebenaran (IAM) macam dulu, jalankan semula arahan grant yang sama.
> Function HTTP ini perlu boleh dipanggil — ia guna token Firebase untuk keselamatan,
> jadi invoker = allUsers TAPI setiap panggilan WAJIB token sah:
> ```bash
> gcloud functions add-iam-policy-binding aiGenerate --region=asia-southeast1 --member=allUsers --role=roles/cloudfunctions.invoker
> gcloud functions add-iam-policy-binding ttsSynthesize --region=asia-southeast1 --member=allUsers --role=roles/cloudfunctions.invoker
> ```

### Langkah 2 — Sahkan proxy hidup (pilihan, cepat)
Buka di browser: `https://asia-southeast1-go-inspect---home-owner.cloudfunctions.net/aiGenerate`
→ patut nampak `{"error":"Sila log masuk."}` (401). Itu BAGUS — maksudnya function hidup
dan menolak orang tanpa token. (Bukan ralat.)

### Langkah 3 — Deploy app baru (Netlify Drop)
Deploy `index.html` yang baru (build `phase4-aiproxy-v1`, flag proxy = ON).
1. Netlify Drop → upload (fail mesti bernama **index.html**).
2. Buka app, **F12 → Console**, taip `GOINSPECT_BUILD` → patut keluar `'phase4-aiproxy-v1'`.
3. **Uji AI menyeluruh:**
   - Chat Ayie (hantar mesej + cuba hantar gambar) → dapat jawapan.
   - Auto-Plan AI (butang dalam Maintenance Planner) → siap.
   - Talk/suara Ayie → menjawab (jika guna).
   - Survey AI (jika guna) → siap.
4. Kalau SEMUA jadi → proxy hidup, key sekarang dilalih lalu server.
   Kalau AI PECAH → roll-back: deploy semula `index.html` lama (build sebelum ni),
   dan bagitau saya error dalam Console.

### Langkah 4 — Sembunyikan key (deploy admin + Simpan sekali)
Hanya buat SELEPAS Langkah 3 berjaya (AI jalan via proxy).
1. Deploy `admin_panel.html` baru (Netlify, admin site).
2. Log masuk admin (super-admin) → buka **Ayie Config**.
   Borang akan papar key sedia ada (dimuatkan automatik).
3. Klik **Simpan**. Ini menulis key ke dokumen `settings/ayieSecrets` (admin-only)
   dan **membuang** key dari `settings/ayieConfig` (supaya user tak boleh baca lagi).
4. Uji semula AI dalam app (chat/auto-plan) → masih jadi (sekarang proxy baca dari
   `ayieSecrets`).

### Langkah 5 — (Tiada perubahan rules diperlukan)
`settings/ayieSecrets` sudah admin-only secara automatik melalui rules sedia ada
(`match /settings/{doc} { allow read, write: if isAdmin(); }`). Tak payah deploy rules.

## Selepas siap
- API key AI tidak lagi boleh dibaca oleh user biasa. Hanya admin (& server) ada akses.
- Setiap tukar key akan datang: buka Ayie Config → Simpan (auto ke `ayieSecrets`).
- Rotasi key ambil masa sehingga ~60 saat untuk berkesan (cache server).

## Roll-back (jika perlu)
- App: deploy semula `index.html` lama. (Atau tukar `let AI_PROXY_ENABLED = true;` →
  `false` dan redeploy — tapi ini perlukan key kembali dalam `ayieConfig`.)
- Cara paling selamat untuk roll-back PENUH: di admin, sebelum buang, key masih ada;
  kalau dah buang dari `ayieConfig`, salin semula dari `ayieSecrets` (admin boleh baca)
  ke `ayieConfig` melalui Firebase Console kalau betul-betul perlu.

## Tip kos (buat bila-bila)
Set **Budget cap** di Google Cloud → Billing → Budgets & alerts (cth RM50/bulan) sebagai
perlindungan tambahan terhadap penyalahgunaan/lonjakan kos.
