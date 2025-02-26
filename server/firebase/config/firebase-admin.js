import admin from 'firebase-admin';

// Parse the service account from environment variable or use local file
let serviceAccount;
try {
  serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : (await import('./serviceAccount.json', { assert: { type: "json" } })).default;
} catch (error) {
  console.error("Error loading Firebase service account:", error);
  throw error;
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin;