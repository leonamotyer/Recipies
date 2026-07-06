/**
 * Single Firebase initialization for the whole app.
 * Exports the app, Realtime Database, Auth, and Storage instances.
 */
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Normalize the RTDB URL from env (strip quotes/trailing slashes, ensure https)
function getDatabaseURL(): string {
  let url = (process.env.NEXT_PUBLIC_FIREBASE_URL || '')
    .replace(/^["']|["']$/g, '')
    .replace(/\/+$/, '')
    .trim();

  if (url && !url.startsWith('http')) {
    url = 'https://' + url.replace(/^\/+/, '');
  }

  if (!url && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    url = `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`;
  }

  if (!url || !url.startsWith('https://')) {
    throw new Error(
      'Invalid Firebase Realtime Database URL. Set NEXT_PUBLIC_FIREBASE_URL in your .env file, ' +
      'e.g. NEXT_PUBLIC_FIREBASE_URL=https://<project-id>-default-rtdb.firebaseio.com'
    );
  }

  return url;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: getDatabaseURL(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db: Database = getDatabase(app);
const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);

export { app, db, auth, storage };
