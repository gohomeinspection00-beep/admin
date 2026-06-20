// =============================================================================
// GoInspect Cloud Functions — Phase 1.5: keep Firebase Auth password == Firestore
// -----------------------------------------------------------------------------
// The admin panel stores each user's password in users/{email}.password and the
// app authenticates via Firebase Auth. Today the Auth password is only set on the
// user's FIRST login and is never updated, so an admin password change (Firestore
// only) leaves the Auth password stale -> after we deploy auth-requiring security
// rules, that user can no longer sign in / sync. The client CANNOT set another
// user's Auth password, so this must run server-side with the Admin SDK.
//
// Region: deployed to asia-southeast1 (closest to the Singapore Firestore). The
// client MUST call it on the same region:
//   firebase.app().functions('asia-southeast1').httpsCallable('reconcileAuthPassword')
//
// Security: every function verifies the CALLER is an admin using the verified ID
// token (context.auth.token.email) checked against the super-admin email or the
// admins/{email} collection — never trusting any client-supplied identity.
// =============================================================================

const functions = require('firebase-functions/v1');
const admin = require('firebase-admin');
admin.initializeApp();

const REGION = 'asia-southeast1';
const SUPER_ADMIN_EMAIL = 'team.gohomeinspection@gmail.com';

// Verify the caller is an admin (super-admin email OR admins/{email} doc exists).
async function assertAdmin(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Sila log masuk sebagai admin.');
  }
  const email = ((context.auth.token && context.auth.token.email) || '').toLowerCase().trim();
  if (!email) {
    throw new functions.https.HttpsError('permission-denied', 'Akaun tiada email.');
  }
  if (email === SUPER_ADMIN_EMAIL) return email;
  const doc = await admin.firestore().collection('admins').doc(email).get();
  if (!doc.exists) {
    throw new functions.https.HttpsError('permission-denied', 'Admin sahaja.');
  }
  return email;
}

// Set (create-or-update) ONE user's Firebase Auth password to match Firestore.
// Called by the admin panel right after it writes users/{email}.password.
exports.reconcileAuthPassword = functions.region(REGION).https.onCall(async (data, context) => {
  await assertAdmin(context);
  const email = (((data && data.email) || '') + '').toLowerCase().trim();
  const password = (data && data.password) || '';
  if (!email) {
    throw new functions.https.HttpsError('invalid-argument', 'email diperlukan.');
  }
  if (typeof password !== 'string' || password.length < 6) {
    // Firebase Auth requires >= 6 chars; report so the admin can lengthen it.
    throw new functions.https.HttpsError('invalid-argument', 'Password mesti sekurang-kurangnya 6 aksara.');
  }
  try {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { password });
    return { ok: true, action: 'updated' };
  } catch (e) {
    if (e && e.code === 'auth/user-not-found') {
      await admin.auth().createUser({ email, password });
      return { ok: true, action: 'created' };
    }
    throw new functions.https.HttpsError('internal', (e && e.message) || 'updateUser failed');
  }
});

// =============================================================================
// Phase 4: AI PROXY — keep the Gemini / Groq / Text-to-Speech API keys server-side
// so a signed-in client can no longer read them out of Firestore.
// -----------------------------------------------------------------------------
// These are thin PASS-THROUGH proxies: the client builds the exact same request
// body it used to send straight to Google, posts it here instead, and we forward
// it with the secret key attached and return Google's response + HTTP status
// VERBATIM. That keeps all existing client behaviour (429 handling, response
// shape data.candidates[...]) working with no logic change.
//
// AUTH: every call requires a valid Firebase ID token (Authorization: Bearer
// <token>) — this is the real protection (stops anonymous abuse of our key).
// CORS is reflected because the token, not the origin, is the security boundary.
//
// KEY SOURCE: settings/ayieSecrets.{apiKey,groqKey,ttsKey}, read with the Admin
// SDK (bypasses security rules). FALLBACK to settings/ayieConfig for the same
// fields so the proxy works BEFORE the one-time key migration (staged rollout).
// =============================================================================

// 60s in-memory cache so we don't read Firestore on every single AI call.
let _aiKeyCache = { at: 0, apiKey: '', groqKey: '', ttsKey: '' };
async function getAiKeys() {
  const now = Date.now();
  if (now - _aiKeyCache.at < 60000 && (_aiKeyCache.apiKey || _aiKeyCache.ttsKey)) {
    return _aiKeyCache;
  }
  const db = admin.firestore();
  let secrets = {};
  try { const s = await db.collection('settings').doc('ayieSecrets').get(); if (s.exists) secrets = s.data() || {}; } catch (e) {}
  let cfg = {};
  try { const c = await db.collection('settings').doc('ayieConfig').get(); if (c.exists) cfg = c.data() || {}; } catch (e) {}
  _aiKeyCache = {
    at: now,
    apiKey: secrets.apiKey || cfg.apiKey || '',
    groqKey: secrets.groqKey || cfg.groqKey || '',
    ttsKey:  secrets.ttsKey  || cfg.ttsKey  || ''
  };
  return _aiKeyCache;
}

// Reflect CORS + verify the Firebase ID token. Returns the decoded token, or null
// (after already sending the 401/preflight response) so the caller should return.
async function corsAndAuth(req, res) {
  res.set('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.set('Vary', 'Origin');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  res.set('Access-Control-Max-Age', '3600');
  if (req.method === 'OPTIONS') { res.status(204).send(''); return null; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return null; }
  const authz = req.headers.authorization || '';
  const m = authz.match(/^Bearer (.+)$/);
  if (!m) { res.status(401).json({ error: 'Sila log masuk.' }); return null; }
  try {
    return await admin.auth().verifyIdToken(m[1]);
  } catch (e) {
    res.status(401).json({ error: 'Token tidak sah.' }); return null;
  }
}

// Gemini / Groq generate proxy. Body: { provider?, model, payload }.
exports.aiGenerate = functions.region(REGION).runWith({ timeoutSeconds: 120, memory: '256MB' }).https.onRequest(async (req, res) => {
  const token = await corsAndAuth(req, res);
  if (!token) return;
  try {
    const body = req.body || {};
    const provider = (body.provider || 'gemini') + '';
    const payload = body.payload;
    if (!payload || typeof payload !== 'object') {
      res.status(400).json({ error: 'payload diperlukan.' }); return;
    }
    const keys = await getAiKeys();

    if (provider === 'groq') {
      if (!keys.groqKey) { res.status(503).json({ error: 'Groq key belum diset.' }); return; }
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + keys.groqKey },
        body: JSON.stringify(payload)
      });
      const text = await r.text();
      res.status(r.status).set('Content-Type', 'application/json').send(text);
      return;
    }

    // Default: Gemini. Validate the model name (it goes into the URL path).
    const model = (body.model || '') + '';
    if (!/^[a-zA-Z0-9._-]{1,64}$/.test(model)) {
      res.status(400).json({ error: 'model tidak sah.' }); return;
    }
    if (!keys.apiKey) { res.status(503).json({ error: 'Gemini key belum diset.' }); return; }
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + model + ':generateContent?key=' + keys.apiKey;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await r.text();
    res.status(r.status).set('Content-Type', 'application/json').send(text);
  } catch (e) {
    res.status(500).json({ error: (e && e.message) || 'proxy error' });
  }
});

// Google Cloud Text-to-Speech proxy. Body: { payload: { input, voice, audioConfig } }.
exports.ttsSynthesize = functions.region(REGION).runWith({ timeoutSeconds: 60, memory: '256MB' }).https.onRequest(async (req, res) => {
  const token = await corsAndAuth(req, res);
  if (!token) return;
  try {
    const payload = (req.body && req.body.payload) || req.body;
    if (!payload || typeof payload !== 'object' || !payload.input) {
      res.status(400).json({ error: 'payload.input diperlukan.' }); return;
    }
    const keys = await getAiKeys();
    if (!keys.ttsKey) { res.status(503).json({ error: 'TTS key belum diset.' }); return; }
    const r = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=' + keys.ttsKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const text = await r.text();
    res.status(r.status).set('Content-Type', 'application/json').send(text);
  } catch (e) {
    res.status(500).json({ error: (e && e.message) || 'tts proxy error' });
  }
});

// ONE-TIME migration: align EVERY users/{email}.password into Firebase Auth, so the
// existing population can't be locked out when the security rules are deployed.
// Super-admin only. Idempotent: re-running just re-sets the same passwords. Reports
// users skipped (no/short password) and any failures so they can be fixed by hand.
exports.reconcileAllPasswords = functions.region(REGION).runWith({ timeoutSeconds: 540, memory: '256MB' }).https.onCall(async (data, context) => {
  const caller = await assertAdmin(context);
  if (caller !== SUPER_ADMIN_EMAIL) {
    throw new functions.https.HttpsError('permission-denied', 'Super admin sahaja untuk migrasi.');
  }
  const snap = await admin.firestore().collection('users').get();
  let created = 0, updated = 0, skipped = 0;
  const failed = [];
  for (const d of snap.docs) {
    const email = ((d.id || '') + '').toLowerCase().trim();
    const password = (d.data() || {}).password || '';
    if (!email || typeof password !== 'string' || password.length < 6) { skipped++; continue; }
    try {
      try {
        const u = await admin.auth().getUserByEmail(email);
        await admin.auth().updateUser(u.uid, { password });
        updated++;
      } catch (e) {
        if (e && e.code === 'auth/user-not-found') {
          await admin.auth().createUser({ email, password });
          created++;
        } else {
          throw e;
        }
      }
    } catch (e) {
      failed.push({ email, error: (e && e.message) || 'failed' });
    }
  }
  return { ok: true, total: snap.size, created, updated, skipped, failed };
});
