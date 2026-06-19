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
