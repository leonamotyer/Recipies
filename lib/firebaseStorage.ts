import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getApps } from 'firebase/app';
import { initializeApp } from 'firebase/app';

// Get Firebase app (reuse existing or create new)
let app;
if (!getApps().length) {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Storage
const storage = getStorage(app);

/**
 * Upload an image file to Firebase Storage
 * @param file - The image file to upload
 * @param recipeId - The recipe ID to associate with the image
 * @returns The download URL of the uploaded image
 */
export async function uploadRecipeImage(file: File, recipeId: string): Promise<string> {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const filename = `${recipeId}/${timestamp}_${file.name}`;
    
    // Create a reference to the file location
    const storageRef = ref(storage, `recipe-images/${filename}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}


