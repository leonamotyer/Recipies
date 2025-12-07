import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  QueryConstraint 
} from 'firebase/firestore';
import { db } from './firebase';

// Updated Recipe interface with categories as array
export interface Recipe {
  id: string;
  title: string;
  categories: string[]; // Changed from single category to array
  time: string;
  servings?: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  fancy?: boolean;
  quick?: boolean;
  cheap?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Get a single recipe by ID
 * @param id - The recipe document ID
 * @returns The recipe document or null if not found
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const recipeRef = doc(db, 'recipes', id);
    const recipeSnap = await getDoc(recipeRef);

    if (!recipeSnap.exists()) {
      return null;
    }

    const data = recipeSnap.data();
    return {
      id: recipeSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Recipe;
  } catch (error) {
    console.error('Error getting recipe by ID:', error);
    throw error;
  }
}

/**
 * Get all recipes from the database
 * @returns Array of all recipes
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    const recipesRef = collection(db, 'recipes');
    const recipesSnap = await getDocs(recipesRef);

    const recipes: Recipe[] = [];
    recipesSnap.forEach((doc) => {
      const data = doc.data();
      recipes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Recipe);
    });

    return recipes;
  } catch (error) {
    console.error('Error getting all recipes:', error);
    throw error;
  }
}

/**
 * Get recipes by category
 * @param category - The category to filter by
 * @returns Array of recipes that include the specified category
 */
export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  try {
    const recipesRef = collection(db, 'recipes');
    const q = query(recipesRef, where('categories', 'array-contains', category));
    const recipesSnap = await getDocs(q);

    const recipes: Recipe[] = [];
    recipesSnap.forEach((doc) => {
      const data = doc.data();
      recipes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Recipe);
    });

    return recipes;
  } catch (error) {
    console.error('Error getting recipes by category:', error);
    throw error;
  }
}

/**
 * Get recipes by multiple filters (fancy, quick, cheap)
 * @param filters - Object with optional filters: fancy, quick, cheap
 * @returns Array of recipes matching the filters
 */
export async function getRecipesByFilters(filters: {
  fancy?: boolean;
  quick?: boolean;
  cheap?: boolean;
}): Promise<Recipe[]> {
  try {
    const recipesRef = collection(db, 'recipes');
    const constraints: QueryConstraint[] = [];

    if (filters.fancy !== undefined) {
      constraints.push(where('fancy', '==', filters.fancy));
    }
    if (filters.quick !== undefined) {
      constraints.push(where('quick', '==', filters.quick));
    }
    if (filters.cheap !== undefined) {
      constraints.push(where('cheap', '==', filters.cheap));
    }

    const q = query(recipesRef, ...constraints);
    const recipesSnap = await getDocs(q);

    const recipes: Recipe[] = [];
    recipesSnap.forEach((doc) => {
      const data = doc.data();
      recipes.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Recipe);
    });

    return recipes;
  } catch (error) {
    console.error('Error getting recipes by filters:', error);
    throw error;
  }
}

