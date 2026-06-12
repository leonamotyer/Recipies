import { Suspense } from "react";
import type { Metadata } from "next";
import Header from "@/app/components/header";
import Filters from "@/app/components/filters";
import RecipeCard from "@/app/components/recipieCard";
import Reveal from "@/app/components/reveal";
import { getAllRecipes, getRecipesByCategory, getRecipesByFilters } from "@/lib/firebaseRecipesRealtime";
import type { Recipe, RecipesPageProps } from "@/lib/data.types";

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "All Recipes | Leona's Recipes",
  description: "Browse all recipes from Leona's collection",
};

export default async function RecipesPage(props: RecipesPageProps) {
  const searchParams = await props.searchParams;
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

    // Apply tag filters (fancy, quick, cheap, crockpot)
    if (searchParams.fancy || searchParams.quick || searchParams.cheap || searchParams.crockpot) {
      const filters: { fancy?: boolean; quick?: boolean; cheap?: boolean; crockpot?: boolean } = {};
      if (searchParams.fancy === 'true') filters.fancy = true;
      if (searchParams.quick === 'true') filters.quick = true;
      if (searchParams.cheap === 'true') filters.cheap = true;
      if (searchParams.crockpot === 'true') filters.crockpot = true;
      
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
    <main className="min-h-screen">
      <Header />

      <section className="py-10 sm:py-14">
        <div className="container mx-auto px-4">
          <div className="fade-up mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-caramel">
              The display case
            </span>
            <h1 className="font-display mt-2 text-4xl sm:text-5xl md:text-6xl text-cocoa">
              <em className="gradient-text">{pageTitle}</em>
            </h1>
            <p className="mt-3 text-sm text-latte">
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"} on the shelf
            </p>
          </div>

          <div className="fade-up mb-10" style={{ "--delay": "0.1s" } as React.CSSProperties}>
            <Suspense
              fallback={
                <div className="glass rounded-3xl p-6">
                  <div className="h-20 animate-pulse rounded-2xl bg-paper-deep" />
                </div>
              }
            >
              <Filters />
            </Suspense>
          </div>

          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 md:gap-8">
              {recipes.map((recipe, index) => (
                <Reveal key={recipe.id} delay={(index % 3) * 0.1}>
                  <RecipeCard recipe={recipe} index={index} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="glass fade-up mx-auto max-w-md rounded-3xl p-12 text-center">
              <p className="mb-4 text-5xl">🧺</p>
              <p className="font-display text-2xl text-cocoa">The basket is empty</p>
              <p className="mt-2 text-sm text-latte">
                Try clearing a filter or searching for something else.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
