/**
 * Data Types for Leona's Recipes Website
 *
 * This file defines all the data types used throughout the application.
 * Recipes are stored in Firebase Realtime Database at /recipes/{id},
 * with images in Firebase Storage under recipe-images/{id}/.
 */

/**
 * Recipe - Main recipe data type
 */
export interface Recipe {
  /** Unique identifier (UUID) */
  id: string;
  
  /** Recipe title */
  title: string;
  
  /** Cooking time in minutes */
  cookTime: number;
  
  /** Full cooking description/instructions */
  cookingDescription: string;
  
  /** Array of dish categories (e.g., ["dinner", "main", "quick", "cheap"]) */
  dishCategories: string[];
  
  /** Recipe ingredients */
  ingredients?: Ingredient[];

  /** Recipe images (download URLs from Firebase Storage) */
  images?: Image[];

  /** Firebase Storage folder holding this recipe's images (e.g. "recipe-images/1") */
  imageFolder?: string;
  
  // Computed/display fields (not in database, added for convenience)
  /** Formatted time string (e.g., "30 min") */
  time?: string;
  
  /** Alias for cookingDescription for backward compatibility */
  description?: string;
  
  /** Alias for dishCategories for backward compatibility */
  categories?: string[];
  
  /** Derived flag: true if dishCategories includes "fancy" */
  fancy?: boolean;
  
  /** Derived flag: true if dishCategories includes "quick" */
  quick?: boolean;
  
  /** Derived flag: true if dishCategories includes "cheap" */
  cheap?: boolean;
  
  /** Derived flag: true if dishCategories includes "crockpot" */
  crockpot?: boolean;

  /** Derived flag: true if title is prefixed with "GR " (Grandma Ripley) */
  grandmaRipley?: boolean;

  /** Title with "GR " prefix removed for display */
  displayTitle?: string;
}

/**
 * Ingredient - Individual ingredient for a recipe
 */
export interface Ingredient {
  /** Unique identifier */
  id: string;

  /** Recipe ID this ingredient belongs to */
  recipeId: string;

  /** Name of the ingredient */
  ingredientName: string;

  /** Measurement/quantity (e.g., "1 cup", "2 tbsp", "to taste") */
  measurement: string;
}

/**
 * Image - Image data
 */
export interface Image {
  /** Unique identifier */
  id: string;

  /** Download URL of the image in Firebase Storage */
  imageUrl: string;

  /** Optional image description */
  description?: string;

  /** Email of the user who uploaded the image */
  uploadedBy?: string;
}

/**
 * Recipe Filters - Used for filtering recipes
 */
export interface RecipeFilters {
  /** Filter by fancy recipes */
  fancy?: boolean;
  
  /** Filter by quick recipes */
  quick?: boolean;
  
  /** Filter by cheap recipes */
  cheap?: boolean;
  
  /** Filter by crockpot recipes */
  crockpot?: boolean;

  /** Filter by Grandma Ripley recipes (title prefixed with "GR ") */
  grandmaRipley?: boolean;
}

/**
 * Common dish categories used in the application
 */
export type DishCategory = 
  | 'dinner'
  | 'main'
  | 'dessert'
  | 'breakfast'
  | 'lunch'
  | 'appetizer'
  | 'side'
  | 'snack'
  | 'fancy'
  | 'quick'
  | 'cheap'
  | 'crockpot';

/**
 * Recipe Card Props - Props for the RecipeCard component
 */
export interface RecipeCardProps {
  /** The recipe data to display */
  recipe: Recipe;
  
  /** Optional index for styling variations */
  index?: number;
}

/**
 * Recipes Page Props - Props for the recipes page
 */
export interface RecipesPageProps {
  /** Search parameters from URL (a Promise as of Next.js 15) */
  searchParams: Promise<{
    /** Search query for title, description, ingredients */
    search?: string;
    
    /** Filter by category */
    category?: string;
    
    /** Filter by time range */
    time?: string;
    
    /** Filter by fancy flag */
    fancy?: string;
    
    /** Filter by quick flag */
    quick?: string;
    
    /** Filter by cheap flag */
    cheap?: string;
    
    /** Filter by crockpot flag */
    crockpot?: string;

    /** Filter by Grandma Ripley flag */
    grandmaRipley?: string;
  }>;
}

