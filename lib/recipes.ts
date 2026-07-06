import { db } from './firebase';
import { ref, get, update, set } from 'firebase/database';
import type { Recipe, Ingredient, RecipeFilters } from './data.types';
import { getRecipeDisplayTitle, isGrandmaRipleyRecipe } from './grandmaRipley';

/**
 * Recipes live at /recipes/{recipeId} in the Realtime Database.
 * Each recipe object stores an `image_folder` linking it to its
 * Firebase Storage folder (recipe-images/{recipeId}) where its images live.
 */
const RECIPES_PATH = 'recipes';

/** Storage folder for a recipe's images */
export function getRecipeImageFolder(recipeId: string): string {
  return `recipe-images/${recipeId}`;
}

// Transform a Realtime Database node into the app's Recipe type
function transformRecipe(data: any, id: string): Recipe {
  const dishCategories = data.dish_category || [];
  const categoriesLower = dishCategories.map((cat: string) => cat.toLowerCase());

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

  const images: any[] = [];
  if (data.image_urls && Array.isArray(data.image_urls)) {
    data.image_urls.forEach((item: any, index: number) => {
      if (typeof item === 'string') {
        images.push({ id: `img-${index}`, imageUrl: item });
      } else if (item && typeof item === 'object') {
        images.push({
          id: item.id || `img-${index}`,
          imageUrl: item.imageUrl || item.image_url,
          uploadedBy: item.uploadedBy || item.uploaded_by,
        });
      }
    });
  }

  const title = data.title || '';
  const grandmaRipley = isGrandmaRipleyRecipe(title);

  return {
    id: id,
    title,
    cookTime: data.cook_time_minutes || 0,
    cookingDescription: data.instructions || '',
    dishCategories: dishCategories,
    ingredients: ingredients,
    images: images.length > 0 ? images : undefined,
    imageFolder: data.image_folder || getRecipeImageFolder(id),
    // Computed fields
    time: `${data.cook_time_minutes || 0} min`,
    description: data.instructions || '',
    categories: dishCategories,
    fancy: categoriesLower.includes('fancy'),
    quick: categoriesLower.includes('quick'),
    cheap: categoriesLower.includes('cheap'),
    crockpot: categoriesLower.includes('crockpot'),
    grandmaRipley,
    displayTitle: grandmaRipley ? getRecipeDisplayTitle(title) : title,
  };
}

/**
 * Get a single recipe by ID (direct lookup at /recipes/{id})
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const snapshot = await get(ref(db, `${RECIPES_PATH}/${id}`));
    if (!snapshot.exists()) {
      return null;
    }
    return transformRecipe(snapshot.val(), id);
  } catch (error) {
    console.error('Error getting recipe by ID:', error);
    throw error;
  }
}

/**
 * Get all recipes from /recipes
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    const snapshot = await get(ref(db, RECIPES_PATH));
    if (!snapshot.exists()) {
      return [];
    }

    const data = snapshot.val();
    const recipes: Recipe[] = [];

    Object.keys(data).forEach((key) => {
      const item = data[key];
      if (item && typeof item === 'object') {
        try {
          recipes.push(transformRecipe(item, key));
        } catch (transformError) {
          console.error(`Error transforming recipe ${key}:`, transformError);
        }
      }
    });

    return recipes;
  } catch (error: any) {
    console.error('Error getting all recipes:', error);
    if (error.code === 'PERMISSION_DENIED') {
      console.error('Permission denied. Check Firebase Realtime Database rules for /recipes.');
    }
    throw error;
  }
}

/**
 * Get recipes by category
 */
export async function getRecipesByCategory(category: string): Promise<Recipe[]> {
  const allRecipes = await getAllRecipes();
  const categoryLower = category.toLowerCase();
  return allRecipes.filter(recipe =>
    recipe.dishCategories.some(cat => cat.toLowerCase() === categoryLower)
  );
}

/**
 * Get recipes matching filter flags (fancy, quick, cheap, crockpot, grandmaRipley)
 */
export async function getRecipesByFilters(filters: RecipeFilters): Promise<Recipe[]> {
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
    if (filters.crockpot !== undefined) {
      matches = matches && (filters.crockpot === categoriesLower.includes('crockpot'));
    }
    if (filters.grandmaRipley !== undefined) {
      matches = matches && (filters.grandmaRipley === !!recipe.grandmaRipley);
    }

    return matches;
  });
}

// Convert the app's Recipe shape into the database wire format
function recipeDataToFirebase(recipeData: Partial<Recipe>): Record<string, unknown> {
  const firebaseData: Record<string, unknown> = {};

  if (recipeData.title !== undefined) {
    firebaseData.title = recipeData.title;
  }
  if (recipeData.cookTime !== undefined) {
    firebaseData.cook_time_minutes = recipeData.cookTime;
  }
  if (recipeData.cookingDescription !== undefined) {
    firebaseData.instructions = recipeData.cookingDescription;
  }
  if (recipeData.dishCategories !== undefined) {
    firebaseData.dish_category = recipeData.dishCategories;
  }
  if (recipeData.ingredients !== undefined) {
    const ingredientsObj: Record<string, string> = {};
    recipeData.ingredients.forEach(ing => {
      const key = ing.ingredientName.replace(/\s+/g, '_');
      ingredientsObj[key] = ing.measurement;
    });
    firebaseData.ingredients = ingredientsObj;
  }
  if (recipeData.images !== undefined) {
    firebaseData.image_urls = recipeData.images.map(img => {
      const entry: { imageUrl: string; uploadedBy?: string } = {
        imageUrl: img.imageUrl,
      };
      if (img.uploadedBy) {
        entry.uploadedBy = img.uploadedBy;
      }
      return entry;
    });
  }

  return firebaseData;
}

// Next numeric recipe id = max existing id + 1
async function getNextRecipeId(): Promise<number> {
  const snapshot = await get(ref(db, RECIPES_PATH));
  let maxId = 0;

  if (snapshot.exists()) {
    for (const key of Object.keys(snapshot.val())) {
      const numKey = parseInt(key, 10);
      if (!isNaN(numKey) && numKey > maxId) {
        maxId = numKey;
      }
    }
  }

  return maxId + 1;
}

/**
 * Create a new recipe at /recipes/{newId}, with its image bucket folder link
 */
export async function createRecipe(recipeData: Partial<Recipe>): Promise<Recipe> {
  try {
    const recipeId = await getNextRecipeId();
    const id = String(recipeId);

    const firebaseData = {
      recipe_id: recipeId,
      image_folder: getRecipeImageFolder(id),
      ...recipeDataToFirebase(recipeData),
    };

    await set(ref(db, `${RECIPES_PATH}/${id}`), firebaseData);

    const created = await getRecipeById(id);
    if (!created) {
      throw new Error('Failed to retrieve created recipe');
    }
    return created;
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
}

/**
 * Update a recipe at /recipes/{id}
 */
export async function updateRecipe(id: string, recipeData: Partial<Recipe>): Promise<Recipe | null> {
  try {
    const existing = await get(ref(db, `${RECIPES_PATH}/${id}`));
    if (!existing.exists()) {
      console.error(`Recipe with ID ${id} not found`);
      return null;
    }

    await update(ref(db, `${RECIPES_PATH}/${id}`), recipeDataToFirebase(recipeData));

    return await getRecipeById(id);
  } catch (error) {
    console.error('Error updating recipe:', error);
    throw error;
  }
}
