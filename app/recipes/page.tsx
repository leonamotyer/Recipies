import Header from "@/app/components/header";
import RecipeCard from "@/app/components/recipieCard";
import { getAllRecipes, getRecipesByCategory, getRecipesByFilters } from "@/lib/firebaseRecipesRealtime";
import type { Recipe, RecipesPageProps } from "@/lib/data.types";


export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  let recipes: Recipe[] = [];
  let pageTitle = "All Recipes";

  try {
    // Filter recipes based on search params
    if (searchParams.category) {
      recipes = await getRecipesByCategory(searchParams.category);
      pageTitle = `${searchParams.category} Recipes`;
    } else if (searchParams.fancy || searchParams.quick || searchParams.cheap) {
      const filters: { fancy?: boolean; quick?: boolean; cheap?: boolean } = {};
      if (searchParams.fancy === 'true') filters.fancy = true;
      if (searchParams.quick === 'true') filters.quick = true;
      if (searchParams.cheap === 'true') filters.cheap = true;
      recipes = await getRecipesByFilters(filters);
      pageTitle = "Filtered Recipes";
    } else {
      recipes = await getAllRecipes();
    }
  } catch (error) {
    console.error('Error fetching recipes:', error);
    // If Firebase isn't configured yet, show empty state
    recipes = [];
  }

  return (
    <main className="min-h-screen bg-primary-dark">
      <Header />

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

