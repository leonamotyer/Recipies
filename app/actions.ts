'use server';

import { revalidatePath } from 'next/cache';

export async function regenerateFeaturedRecipes() {
  revalidatePath('/', 'page');
  return { success: true };
}

/**
 * Revalidate cached pages after a recipe is updated client-side.
 * The actual database write happens in the browser so it carries the
 * signed-in user's Firebase Auth credentials (required by database rules).
 */
export async function revalidateRecipePaths(id: string) {
  revalidatePath(`/recipes/${id}`);
  revalidatePath('/recipes');
  revalidatePath('/');
  return { success: true };
}
