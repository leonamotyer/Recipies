import Header from "@/app/components/header";
import Filters from "@/app/components/filters";
import RecipeCard from "@/app/components/recipieCard";
import { getAllRecipes, getRecipesByCategory, getRecipesByFilters } from "@/lib/firebaseRecipesRealtime";
import type { Recipe, RecipesPageProps } from "@/lib/data.types";


export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  let recipes: Recipe[] = [];
  let pageTitle = "All Recipes";

  try {
    let allRecipes = await getAllRecipes();
    
    // Apply search filter if provided
    if (searchParams.search) {
      const searchLower = searchParams.search.toLowerCase();
      allRecipes = allRecipes.filter(recipe => 
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.description?.toLowerCase().includes(searchLower) ||
        recipe.cookingDescription?.toLowerCase().includes(searchLower) ||
        recipe.ingredients?.some(ing => 
          ing.ingredientName.toLowerCase().includes(searchLower) ||
          ing.measurement.toLowerCase().includes(searchLower)
        )
      );
    }

    // Apply time filter if provided
    if (searchParams.time) {
      const timeValue = searchParams.time;
      allRecipes = allRecipes.filter(recipe => {
        const cookTime = recipe.cookTime || 0;
        if (timeValue === '15') return cookTime < 15;
        if (timeValue === '30') return cookTime >= 15 && cookTime <= 30;
        if (timeValue === '60') return cookTime > 30 && cookTime <= 60;
        if (timeValue === '60+') return cookTime > 60;
        return true;
      });
    }

    // Apply category filter
    if (searchParams.category) {
      const categoryLower = searchParams.category.toLowerCase();
      allRecipes = allRecipes.filter(recipe => 
        recipe.dishCategories.some(cat => {
          const catLower = cat.toLowerCase();
          // Match exact or if search term is contained in category (e.g., "main" matches "main course")
          return catLower === categoryLower || catLower.includes(categoryLower) || categoryLower.includes(catLower);
        })
      );
      // Capitalize category name for display
      const categoryWords = searchParams.category.toLowerCase().split(' ');
      const capitalizedCategory = categoryWords
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      // Convert "desert" (database spelling) to "Desserts" (correct spelling) for display
      const displayCategory = capitalizedCategory === 'Desert' ? 'Desserts' : capitalizedCategory;
      pageTitle = `${displayCategory} Recipes`;
    }

    // Apply tag filters (fancy, quick, cheap)
    if (searchParams.fancy || searchParams.quick || searchParams.cheap) {
      const filters: { fancy?: boolean; quick?: boolean; cheap?: boolean } = {};
      if (searchParams.fancy === 'true') filters.fancy = true;
      if (searchParams.quick === 'true') filters.quick = true;
      if (searchParams.cheap === 'true') filters.cheap = true;
      
      const filteredByTags = await getRecipesByFilters(filters);
      // Combine with already filtered recipes
      const filteredIds = new Set(filteredByTags.map(r => r.id));
      allRecipes = allRecipes.filter(r => filteredIds.has(r.id));
      
      if (!searchParams.category) {
        pageTitle = "Filtered Recipes";
      }
    }

    recipes = allRecipes;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    // If Firebase isn't configured yet, show empty state
    recipes = [];
  }

  return (
    <main className="min-h-screen bg-primary-dark">
      <Header />
      <Filters />

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold text-text-color mb-12 text-center">{pageTitle}</h1>
          
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-color text-lg">No recipes found.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

