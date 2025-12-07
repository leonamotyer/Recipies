import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Load recipes from JSON file
const recipesPath = path.join(__dirname, '../recipies.json');
const recipesData = JSON.parse(fs.readFileSync(recipesPath, 'utf-8'));

// Transform recipe data to match Firestore schema
function transformRecipe(recipe: any) {
  // Convert ingredients object to array
  const ingredientsArray = Object.entries(recipe.ingredients || {}).map(
    ([key, value]) => `${key}: ${value}`
  );

  // Convert instructions string to array (split by periods or newlines)
  const instructionsArray = recipe.instructions
    ? recipe.instructions
        .split(/[.!?]\s+/)
        .map((inst: string) => inst.trim())
        .filter((inst: string) => inst.length > 0)
    : [];

  // Map dish_category to categories (capitalize first letter)
  const categories = (recipe.dish_category || []).map((cat: string) =>
    cat.charAt(0).toUpperCase() + cat.slice(1)
  );

  // Determine fancy, quick, cheap flags
  const fancy = recipe.dish_category?.includes('fancy') || false;
  const quick = recipe.dish_category?.includes('quick') || false;
  const cheap = recipe.dish_category?.includes('cheap') || false;

  // Format time
  const time = recipe.cook_time_minutes
    ? `${recipe.cook_time_minutes} min`
    : 'Time not specified';

  return {
    title: recipe.title,
    categories: categories,
    time: time,
    ingredients: ingredientsArray,
    instructions: instructionsArray,
    fancy: fancy,
    quick: quick,
    cheap: cheap,
    description: recipe.instructions?.substring(0, 150) + '...' || '',
    imageId: recipe.image_id || null,
    tags: recipe.tags || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

async function importRecipes() {
  try {
    console.log('Starting recipe import...');
    console.log(`Found ${recipesData.length} recipes to import\n`);

    const recipesRef = collection(db, 'recipes');
    let imported = 0;
    let errors = 0;

    for (const recipe of recipesData) {
      try {
        const transformedRecipe = transformRecipe(recipe);
        await addDoc(recipesRef, transformedRecipe);
        imported++;
        console.log(`✓ Imported: ${recipe.title} (${imported}/${recipesData.length})`);
      } catch (error) {
        errors++;
        console.error(`✗ Error importing ${recipe.title}:`, error);
      }
    }

    console.log('\n=== Import Complete ===');
    console.log(`Successfully imported: ${imported}`);
    console.log(`Errors: ${errors}`);
  } catch (error) {
    console.error('Fatal error during import:', error);
    process.exit(1);
  }
}

// Run the import
importRecipes()
  .then(() => {
    console.log('\nImport script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import script failed:', error);
    process.exit(1);
  });
