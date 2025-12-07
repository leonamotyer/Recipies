import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

console.log('Testing Firebase connection...');
console.log('Project ID:', firebaseConfig.projectId);
console.log('Auth Domain:', firebaseConfig.authDomain);
console.log('');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
  try {
    console.log('Attempting to connect to Firestore...');
    
    // Try to read from the recipes collection
    const recipesRef = collection(db, 'recipes');
    const snapshot = await getDocs(recipesRef);
    
    console.log('✓ Successfully connected to Firestore!');
    console.log(`✓ Found ${snapshot.size} recipes in the database`);
    
    if (snapshot.size > 0) {
      console.log('\nSample recipes:');
      snapshot.docs.slice(0, 3).forEach((doc) => {
        const data = doc.data();
        console.log(`  - ${data.title} (ID: ${doc.id})`);
      });
    } else {
      console.log('\n⚠️  No recipes found. The collection exists but is empty.');
      console.log('   You can import recipes using: npm run import-recipes');
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('✗ Connection failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'permission-denied') {
      console.error('\n⚠️  Permission denied. Make sure Firestore rules allow read access.');
      console.error('   Go to Firebase Console > Firestore > Rules and set:');
      console.error('   allow read: if true;');
    } else if (error.code === 'not-found') {
      console.error('\n⚠️  Database not found. Make sure Firestore is enabled in Firebase Console.');
    } else {
      console.error('\nCheck:');
      console.error('  1. .env.local file exists with correct values');
      console.error('  2. Firestore is enabled in Firebase Console');
      console.error('  3. Security rules allow read access');
    }
    
    process.exit(1);
  }
}

testConnection();

