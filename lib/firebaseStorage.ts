import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';
import { getRecipeImageFolder } from './recipes';

/**
 * Upload an image to the recipe's Storage folder (recipe-images/{recipeId}/)
 * @param file - The image file to upload
 * @param recipeId - The recipe the image belongs to
 * @returns The download URL of the uploaded image
 */
export async function uploadRecipeImage(file: File, recipeId: string): Promise<string> {
  try {
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${getRecipeImageFolder(recipeId)}/${filename}`);

    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}
