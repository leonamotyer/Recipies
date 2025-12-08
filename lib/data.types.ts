/**
 * Data Types for Leona's Recipes Website
 * 
 * This file defines all the data types used throughout the application,
 * matching the Firebase Data Connect schema structure.
 */

/**
 * Recipe - Main recipe data type
 * Matches the Recipe model in Firebase Data Connect
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
  
  /** Related ingredients (populated from Ingredient table via relationship) */
  ingredients?: Ingredient[];
  
  /** Related images (populated from Image table via RecipeImage junction) */
  images?: Image[];
  
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
}

/**
 * Ingredient - Individual ingredient for a recipe
 * Matches the Ingredient model in Firebase Data Connect
 */
export interface Ingredient {
  /** Unique identifier (UUID) */
  id: string;
  
  /** Foreign key: Recipe ID this ingredient belongs to */
  recipeId: string;
  
  /** Name of the ingredient */
  ingredientName: string;
  
  /** Measurement/quantity (e.g., "1 cup", "2 tbsp", "to taste") */
  measurement: string;
  
  /** Relationship to Recipe (populated via GraphQL) */
  recipe?: Recipe;
}

/**
 * Image - Image data
 * Matches the Image model in Firebase Data Connect
 */
export interface Image {
  /** Unique identifier (UUID) */
  id: string;
  
  /** URL to the image */
  imageUrl: string;
  
  /** Optional image description */
  description?: string;
  
  /** Email of the user who uploaded the image */
  uploadedBy?: string;
}

/**
 * RecipeImage - Junction table linking recipes to images
 * Matches the RecipeImage model in Firebase Data Connect
 */
export interface RecipeImage {
  /** Foreign key: Recipe ID */
  recipeId: string;
  
  /** Foreign key: Image ID */
  imageId: string;
  
  /** Relationship to Recipe (populated via GraphQL) */
  recipe?: Recipe;
  
  /** Relationship to Image (populated via GraphQL) */
  image?: Image;
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
}

/**
 * GraphQL Query Response Types
 */
export interface GetAllRecipesResponse {
  recipes: Recipe[];
}

export interface GetRecipeByIdResponse {
  recipe: Recipe | null;
}

export interface GetRecipesByCategoryResponse {
  recipes: Recipe[];
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
  | 'cheap';

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
  /** Search parameters from URL */
  searchParams: {
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
  };
}

