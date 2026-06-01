# Firebase Security — AI key exposure (audit finding H6)

## The problem
The AI provider keys (Gemini, Groq, Google TTS) are stored in the Firestore
document `settings/ayieConfig` and read by the client (`index.html`) at runtime.
With Firestore in default/test mode, **any logged-in user can open DevTools and
read those keys**, then use them off-platform — billed to your account.

This cannot be fixed in `index.html` alone: whatever the browser can read, the
user can read. It must be fixed with **Firestore Security Rules** (and, ideally,
a server-side proxy for the keys).

## What's in this repo
- `firestore.rules` — a security-rules **template** that:
  - locks each user's `users/{email}`, `backups`, `trackInspections`, `orders`
    and `homeSurveys` to that user (or an admin);
  - restricts `settings/ayieConfig` (the AI keys) to **admins only**;
  - denies everything else by default.
- `firebase.json` — points the Firebase CLI at `firestore.rules`.

## Deploy (only after testing — see warning below)
```bash
npm install -g firebase-tools     # if not installed
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules
```

## ⚠️ Test before you trust it
Deploying wrong rules on a live app can lock real users out of their own data.
Before deploying:
1. Firebase Console → Firestore → **Rules** → paste `firestore.rules`.
2. Open the **Rules Playground** and simulate:
   - user reading their **own** `backups/{id}` → should **Allow**
   - user reading **someone else's** `backups/{id}` → should **Deny**
   - **admin** reading `settings/ayieConfig` → should **Allow**
   - **normal user** reading `settings/ayieConfig` → should **Deny**
3. Then exercise the real app with a normal (non-admin) account end-to-end.

## The AI-keys trade-off (read this)
The current client **reads `settings/ayieConfig` directly** to call the AI
providers. If you apply the admin-only rule as written, **normal users' AI
features (Ayie chat/voice, Survey AI) will stop working**, because the keys live
in the browser.

Two options:
- **Phase 1 (quick, partial):** in `firestore.rules`, change the
  `settings/ayieConfig` block to `allow read: if isSignedIn();` and keep
  `allow write: if isAdmin();`. This stops tampering and stops *anonymous*
  access, but a logged-in user can still extract the keys. AI keeps working with
  no code change.
- **Phase 2 (recommended, secure):** move every AI call to a **Cloud Function**
  (or other backend) that holds the keys server-side; the client calls your
  function, never the provider directly. Then keep `settings/ayieConfig` as
  admin-only read. The client never sees a key.

Until Phase 2 is in place, treat the AI keys as potentially exposed: keep tight
billing quotas/alerts on the Gemini/Groq/Google Cloud keys, and rotate them if
you suspect abuse.

## Note on email case
The app stores all emails lowercased. The rules compare against
`request.auth.token.email.lower()`. If any account was registered with a
mixed-case email, verify `lower()` behaves as expected in the Playground.
