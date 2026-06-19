# Phase 1.5 — Deploy the password-reconciliation Cloud Function

## Why
The admin panel stores each user's password in Firestore and the app logs in via
Firebase Auth. Today the Auth password is only set on a user's **first login** and
never updated — so when an admin later changes a password (Firestore only), the
Auth password goes stale. Once we deploy the auth-requiring security rules, those
"drift" users could no longer sign in / sync. The client cannot set another user's
Auth password, so this is fixed with a Cloud Function (Admin SDK) that keeps Auth
password == Firestore password.

## What was added
- `functions/index.js`
  - `reconcileAuthPassword({email,password})` — callable, **admin-only**. Sets one
    user's Auth password (create-or-update). The admin panel calls this automatically
    right after it creates/edits a user's password.
  - `reconcileAllPasswords()` — callable, **super-admin only**. One-time migration
    over every user. Idempotent (safe to re-run). Reports created/updated/skipped
    (password empty or < 6 chars)/failed.
- `functions/package.json`, `firebase.json` (functions block, region `asia-southeast1`).
- `admin_panel.html` — loads the functions SDK, calls `reconcileAuthPassword` after
  the 4 password-write paths, and adds a **"Selaras Password (Auth)"** button under
  Settings → Database Maintenance for the one-time migration.

## Deploy steps (run on your computer, once)
```bash
# 1. Firebase CLI (skip if already installed)
npm install -g firebase-tools
firebase login

# 2. From the repo root, point at your project
firebase use go-inspect---home-owner     # or: firebase use --add  then pick it

# 3. Install function deps
cd functions
npm install
cd ..

# 4. Deploy ONLY the functions (does NOT deploy rules — that's a later phase)
firebase deploy --only functions
```
On success the CLI prints the two function names. Region is `asia-southeast1`
(matches the client). If you ever change the region, update `REGION` in
`functions/index.js` AND `FUNCTIONS_REGION` in `admin_panel.html` to match.

## After deploy — run the one-time migration
1. Deploy the new `admin_panel.html` (it now loads the functions SDK + has the button).
2. Open the admin panel as the **super-admin** (team.gohomeinspection@gmail.com).
3. Settings → Database Maintenance → **"Selaras Password (Auth)"** → confirm.
4. Read the result: `dicipta X, dikemaskini Y, dilangkau Z, GAGAL …`.
   - **Dilangkau (skipped)** = users whose Firestore password is empty or < 6 chars.
     Firebase Auth needs ≥ 6 chars — set a longer password for those users (edit
     user → the auto-sync will align Auth), then re-run if you like.
   - **Gagal (failed)** = listed by email; fix and re-run (idempotent).

## Important
- This phase does **not** deploy the security rules and does **not** flip the app's
  `AUTH_ENFORCED` flag. The app behaviour is unchanged. We deploy rules + flip the
  flag only AFTER this migration shows everyone is reconciled (Phase 2).
- Going forward, every admin create/password-edit auto-syncs Auth (no drift).
- Cost: Cloud Functions need the Blaze plan (you're already on it). The migration
  is one invocation; ongoing calls are tiny.
