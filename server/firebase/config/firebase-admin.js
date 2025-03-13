import admin from 'firebase-admin';
import { readFileSync, existsSync } from 'fs';

// Parse the service account from environment variable or use local file
let serviceAccount;
const localPath = './firebase/config/serviceAccount.json'; // Local development
const serverPath = '/etc/secrets/serviceAccount.json'; // Render path

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Parse service account from environment variable
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Determine the correct file path
    const filePath = existsSync(serverPath) ? serverPath : localPath;
    const serviceAccountJson = readFileSync(filePath, 'utf8');
    serviceAccount = JSON.parse(serviceAccountJson);
  }

} catch (error) {
  console.error("Error loading Firebase service account:", error);
  throw error;
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export default admin;