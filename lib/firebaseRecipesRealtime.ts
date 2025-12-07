import { db } from './firebaseRealtime';
import { ref, get, child } from 'firebase/database';
import type { Recipe, Ingredient, RecipeFilters } from './data.types';

// Helper function to transform Realtime Database data to Recipe
function transformRecipe(data: any, id: string): Recipe {
  const dishCategories = data.dish_category || [];
  const categoriesLower = dishCategories.map((cat: string) => cat.toLowerCase());
  
  // Transform ingredients from object to array
  const ingredients: Ingredient[] = [];
  if (data.ingredients && typeof data.ingredients === 'object') {
    Object.entries(data.ingredients).forEach(([key, value]) => {
      ingredients.push({
        id: key,
        recipeId: id,
        ingredientName: key.replace(/_/g, ' '),
        measurement: typeof value === 'string' ? value : String(value),
      });
    });
  }
  
  return {
    id: id,
    title: data.title || '',
    cookTime: data.cook_time_minutes || 0,
    cookingDescription: data.instructions || '',
    dishCategories: dishCategories,
    ingredients: ingredients,
    // Computed fields
    time: `${data.cook_time_minutes || 0} min`,
    description: data.instructions || '',
    categories: dishCategories,
    fancy: categoriesLower.includes('fancy'),
    quick: categoriesLower.includes('quick'),
    cheap: categoriesLower.includes('cheap'),
  };
}

/**
 * Get a single recipe by ID
 * @param id - The recipe ID
 * @returns The recipe document or null if not found
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    // First try to find by recipe_id at root level
    const rootRef = ref(db, '/');
    const snapshot = await get(rootRef);
    
    if (!snapshot.exists()) {
      return null;
    }
    
    const rootData = snapshot.val();
    
    // Search for recipe with matching recipe_id or key
    for (const key of Object.keys(rootData)) {
      const item = rootData[key];
      if (item && typeof item === 'object') {
        const recipeId = item.recipe_id !== undefined ? String(item.recipe_id) : key;
        if (recipeId === id || key === id) {
          return transformRecipe(item, recipeId);
        }
      }
    }
    
    return null;
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
    // Recipes are stored at root level with numeric keys (0, 1, 2, etc.)
    const rootRef = ref(db, '/');
    const snapshot = await get(rootRef);
    
    if (!snapshot.exists()) {
      console.log('No data found at root level');
      return [];
    }
    
    const rootData = snapshot.val();
    const recipes: Recipe[] = [];
    
    // Iterate through all keys at root level
    Object.keys(rootData).forEach((key) => {
      const item = rootData[key];
      // Check if this looks like a recipe (has title or cook_time_minutes)
      if (item && typeof item === 'object' && (item.title || item.cook_time_minutes !== undefined)) {
        try {
          // Use recipe_id if available, otherwise use the key
          const recipeId = item.recipe_id !== undefined ? String(item.recipe_id) : key;
          recipes.push(transformRecipe(item, recipeId));
        } catch (transformError) {
          console.error(`Error transforming recipe ${key}:`, transformError);
        }
      }
    });
    
    console.log(`Successfully loaded ${recipes.length} recipes from root level`);
    return recipes;
  } catch (error: any) {
    console.error('Error getting all recipes:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    if (error.code === 'PERMISSION_DENIED') {
      console.error('⚠️  Permission denied. Check Firebase Realtime Database rules.');
    }
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
    const allRecipes = await getAllRecipes();
    const categoryLower = category.toLowerCase();
    
    return allRecipes.filter(recipe => 
      recipe.dishCategories.some(cat => cat.toLowerCase() === categoryLower)
    );
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
export async function getRecipesByFilters(filters: RecipeFilters): Promise<Recipe[]> {
  try {
    const allRecipes = await getAllRecipes();
    
    return allRecipes.filter(recipe => {
      const categoriesLower = recipe.dishCategories.map(cat => cat.toLowerCase());
      
      let matches = true;
      if (filters.fancy !== undefined) {
        matches = matches && (filters.fancy === categoriesLower.includes('fancy'));
      }
      if (filters.quick !== undefined) {
        matches = matches && (filters.quick === categoriesLower.includes('quick'));
      }
      if (filters.cheap !== undefined) {
        matches = matches && (filters.cheap === categoriesLower.includes('cheap'));
      }
      
      return matches;
    });
  } catch (error) {
    console.error('Error getting recipes by filters:', error);
    throw error;
  }
}

