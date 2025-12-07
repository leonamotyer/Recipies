import { apolloClient } from './graphqlClient';
import { 
  GET_ALL_RECIPES, 
  GET_RECIPE_BY_ID, 
  GET_RECIPES_BY_CATEGORY,
  GET_RECIPE_FULL 
} from './graphql/queries';
import type { Recipe, Ingredient, Image, RecipeFilters } from './data.types';

// Re-export types for convenience
export type { Recipe, Ingredient, Image, RecipeFilters } from './data.types';

// Helper function to transform GraphQL response to Recipe
function transformRecipe(data: any): Recipe {
  const dishCategories = data.dishCategories || [];
  const categoriesLower = dishCategories.map((cat: string) => cat.toLowerCase());
  
  return {
    id: data.id,
    title: data.title,
    cookTime: data.cookTime,
    cookingDescription: data.cookingDescription,
    dishCategories: dishCategories,
    ingredients: data.ingredients || [],
    images: data.recipeImages?.map((ri: any) => ri.image) || [],
    // Computed fields
    time: `${data.cookTime} min`,
    description: data.cookingDescription,
    categories: dishCategories,
    fancy: categoriesLower.includes('fancy'),
    quick: categoriesLower.includes('quick'),
    cheap: categoriesLower.includes('cheap'),
  };
}

/**
 * Get a single recipe by ID
 * @param id - The recipe UUID
 * @returns The recipe document or null if not found
 */
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const { data } = await apolloClient.query({
      query: GET_RECIPE_FULL,
      variables: { id },
      fetchPolicy: 'network-only',
    });

    if (!data || !data.recipe) {
      return null;
    }

    return transformRecipe(data.recipe);
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
    const { data, error } = await apolloClient.query({
      query: GET_ALL_RECIPES,
      fetchPolicy: 'network-only',
    });

    if (error) {
      console.error('GraphQL Error:', error);
      if (error.networkError) {
        console.error('Network Error Details:', {
          statusCode: (error.networkError as any).statusCode,
          message: error.networkError.message,
        });
        if ((error.networkError as any).statusCode === 404) {
          console.error('⚠️  404 Error: Data Connect service may not be deployed.');
          console.error('   Go to Firebase Console > Data Connect > Service and click "Deploy"');
        }
      }
      throw error;
    }

    if (!data || !data.recipes) {
      return [];
    }

    return data.recipes.map(transformRecipe);
  } catch (error: any) {
    console.error('Error getting all recipes:', error);
    
    // Provide helpful error messages
    if (error.networkError?.statusCode === 404) {
      console.error('\n🔧 Troubleshooting:');
      console.error('   1. Go to Firebase Console > Data Connect > Service');
      console.error('   2. Click "Deploy" or "Publish" to deploy your service');
      console.error('   3. Get the endpoint URL from Settings tab');
      console.error('   4. Add NEXT_PUBLIC_DATA_CONNECT_ENDPOINT to .env.local');
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
    // Try the GraphQL query first
    try {
      const { data } = await apolloClient.query({
        query: GET_RECIPES_BY_CATEGORY,
        variables: { category: category.toLowerCase() },
        fetchPolicy: 'network-only',
      });

      if (data && data.recipes) {
        return data.recipes.map(transformRecipe);
      }
    } catch (queryError) {
      console.warn('Category query failed, falling back to client-side filter:', queryError);
    }

    // Fallback: get all recipes and filter client-side
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
    // Get all recipes and filter client-side
    // (Firebase Data Connect may need custom queries for complex filters)
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

