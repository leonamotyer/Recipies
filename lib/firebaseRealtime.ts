import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, get, child, Database } from 'firebase/database';

// Get database URL and clean it up (remove quotes, trailing slashes, handle colon syntax)
const getDatabaseURL = () => {
  // Try multiple environment variable names
  let url = process.env.NEXT_PUBLIC_FIREBASE_URL || 
            process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || 
            process.env.FIREBASE_URL || 
            '';
  
  // Debug: log what we got
  if (typeof window === 'undefined') {
    console.log('Raw database URL from env:', url);
  }
  
  // Handle colon syntax (NEXT_PUBLIC_FIREBASE_URL:"value")
  if (url.includes(':') && !url.startsWith('http')) {
    const parts = url.split(':');
    if (parts.length > 1) {
      url = parts.slice(1).join(':').trim();
    }
  }
  
  // Remove quotes and trailing slashes
  url = url.replace(/^["']|["']$/g, '').replace(/\/+$/, '').trim();
  
  // Ensure URL starts with https://
  if (url && !url.startsWith('http')) {
    if (url.startsWith('//')) {
      url = 'https:' + url;
    } else {
      url = 'https://' + url;
    }
  }
  
  // If still empty, try to construct from project ID
  if (!url && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    url = `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`;
    if (typeof window === 'undefined') {
      console.log('⚠️  NEXT_PUBLIC_FIREBASE_URL not found, using default:', url);
      console.log('   To fix: Update .env file to use = instead of :');
      console.log('   Change: NEXT_PUBLIC_FIREBASE_URL:"..."');
      console.log('   To:     NEXT_PUBLIC_FIREBASE_URL=https://...');
    }
  }
  
  // Validate URL format
  if (!url || !url.startsWith('https://') || !url.includes('.firebaseio.com')) {
    const errorMsg = `Invalid Firebase Realtime Database URL: "${url}". 
Expected format: https://<project-id>.firebaseio.com
Please check your .env file and ensure NEXT_PUBLIC_FIREBASE_URL is set correctly.
Example: NEXT_PUBLIC_FIREBASE_URL=https://leonasrecipes-6f85a-default-rtdb.firebaseio.com`;
    console.error(errorMsg);
    throw new Error(errorMsg);
  }
  
  if (typeof window === 'undefined') {
    console.log('Using database URL:', url);
  }
  
  return url;
};

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: getDatabaseURL(),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Realtime Database
let db: Database;
if (typeof window !== 'undefined') {
  db = getDatabase(app);
} else {
  db = getDatabase(app);
}

export { db };

