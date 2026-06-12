export const GRANDMA_RIPLEY_TAG = "Grandma Ripley";

/** True when the recipe title is prefixed with "GR " (Grandma Ripley). */
export function isGrandmaRipleyRecipe(title: string): boolean {
  return /^GR\s+/i.test(title.trim());
}

/** Strip the "GR " prefix for display. */
export function getRecipeDisplayTitle(title: string): string {
  return title.replace(/^GR\s+/i, "").trim();
}
