import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Header from "@/app/components/header";
import RecipeCard from "@/app/components/recipieCard";
import RegenerateButton from "@/app/components/regenerateButton";
import { getAllRecipes } from "@/lib/firebaseRecipesRealtime";
import { unstable_cache } from "next/cache";
import type { Recipe } from "@/lib/data.types";

export const metadata: Metadata = {
  title: "Leona's Recipes",
  description: "Recipes that I've collected over the years!",
};

// Helper function to shuffle array and get random items
function getRandomRecipes(recipes: Recipe[], count: number): Recipe[] {
  const shuffled = [...recipes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Cache the random featured recipes
const getFeaturedRecipes = unstable_cache(
  async () => {
    try {
      const allRecipes = await getAllRecipes();
      return getRandomRecipes(allRecipes, 4);
    } catch (error) {
      console.error('Error fetching featured recipes:', error);
      return [];
    }
  },
  ['featured-recipes'],
  { revalidate: 3600 } // Revalidate every hour
);

export default async function Home() {
  // Get 4 random featured recipes (cached)
  const featuredRecipes: Recipe[] = await getFeaturedRecipes();

  return (
    <main className="min-h-screen bg-primary-dark">
      <Header />

      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
     
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-color mb-4">
              Leona&apos;s Recipes
            </h1>
          </div>
          <p className="text-lg sm:text-xl text-text-color mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
           Recipies that I&apos;ve collected over the years!
          </p>
          <Link
            href="/recipes"
            className="inline-block bg-primary-dark text-text-color hover:text-secondary-dark px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-base"
          >
            Browse Recipes
          </Link>
        </div>
      </section>

      {/* Featured Recipes Section */}
      {featuredRecipes.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 md:mb-12">
              <span className="text-text-color text-xl sm:text-2xl">✧</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-color text-center">
                Featured Recipes
              </h2>
              <span className="text-text-color text-xl sm:text-2xl">✧</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {featuredRecipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </div>
            <RegenerateButton />
          </div>
        </section>
      )}

      {/* Empty State */}
      {featuredRecipes.length === 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center py-12">
              <p className="text-text-color text-lg">No recipes available. Please configure Firebase to see recipes.</p>
            </div>
          </div>
        </section>
      )}

      {/* Footer Divider */}
      <div className="relative py-4 sm:py-6 md:py-8 overflow-hidden mt-8 sm:mt-12 md:mt-16">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Image 
            src="/Elegant-Flourish-Frame-Extrapolated-19.svg" 
            alt="Footer Divider" 
            width={1200} 
            height={200} 
            className="w-full max-w-5xl h-auto"
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="text-text-color py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text-color/90 text-sm sm:text-base">
            © 2024 RecipeHub. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

