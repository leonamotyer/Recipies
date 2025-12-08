'use server';

import { revalidatePath } from 'next/cache';

export async function regenerateFeaturedRecipes() {
  revalidatePath('/', 'page');
  return { success: true };
}

