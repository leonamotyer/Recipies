import Link from "next/link";
import Header from "@/app/components/header";
import { getRecipeById } from "@/lib/firebaseRecipesRealtime";
import type { Recipe } from "@/lib/data.types";

interface RecipePageProps {
  params: {
    id: string;
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const recipe: Recipe | null = await getRecipeById(params.id);

  if (!recipe) {
    return (
      <main className="min-h-screen bg-primary-dark">
        <Header />
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold text-text-color mb-4">Recipe Not Found</h1>
              <p className="text-text-color text-lg mb-8">The recipe you&apos;re looking for doesn&apos;t exist.</p>
              <Link
                href="/recipes"
                className="inline-block bg-primary-dark text-text-color hover:text-secondary-dark px-6 py-3 rounded-full font-semibold"
              >
                Back to Recipes
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // Only show time if cookTime is valid (> 0)
  const hasValidTime = recipe.cookTime && recipe.cookTime > 0;
  const displayTime = hasValidTime ? (recipe.time || `${recipe.cookTime} min`) : null;
  const categories = recipe.dishCategories || recipe.categories || [];

  return (
    <main className="min-h-screen bg-primary-dark">
      <Header />

      <section className="py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Back Button */}
          <div className="mb-4 sm:mb-6">
            <Link
              href="/recipes"
              className="inline-flex items-center text-text-color hover:text-secondary-dark font-medium text-sm sm:text-base"
            >
              ← Back to Recipes
            </Link>
          </div>

          {/* Recipe Header */}
          <div className="bg-gray-300 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <div className="text-center mb-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-text-color mb-2 break-words">
                {recipe.title}
              </h1>
              {displayTime && (
                <span className="text-base sm:text-lg text-text-color font-medium">
                  {displayTime}
                </span>
              )}
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {categories.map((cat, index) => (
                  <span
                    key={index}
                    className="text-sm text-primary-dark font-semibold bg-white px-3 py-1 rounded-full"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Ingredients Section */}
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div className="bg-gray-300 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-text-color mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="text-text-color text-base sm:text-lg">
                    <span className="font-medium">{ingredient.ingredientName}:</span> {ingredient.measurement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Instructions Section */}
          {recipe.cookingDescription && (
            <div className="bg-gray-300 rounded-2xl p-4 sm:p-6 md:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-text-color mb-4">Instructions</h2>
              <div className="text-text-color text-base sm:text-lg whitespace-pre-line leading-relaxed">
                {recipe.cookingDescription}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
