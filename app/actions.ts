'use server';

import { revalidatePath } from 'next/cache';
import { updateRecipe } from '@/lib/firebaseRecipesRealtime';
import { uploadRecipeImage } from '@/lib/firebaseStorage';
import type { Recipe } from '@/lib/data.types';

export async function regenerateFeaturedRecipes() {
  revalidatePath('/', 'page');
  return { success: true };
}

export async function updateRecipeAction(id: string, recipeData: Partial<Recipe>) {
  try {
    const updatedRecipe = await updateRecipe(id, recipeData);
    if (!updatedRecipe) {
      return { success: false, error: 'Recipe not found' };
    }
    // Revalidate the recipe page and recipes list
    revalidatePath(`/recipes/${id}`);
    revalidatePath('/recipes');
    revalidatePath('/');
    return { success: true, recipe: updatedRecipe };
  } catch (error) {
    console.error('Error updating recipe:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update recipe' };
  }
}


