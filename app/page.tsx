import Link from "next/link";
import Image from "next/image";
import Header from "@/app/components/header";
import RecipeCard from "@/app/components/recipieCard";
import { getAllRecipes, Recipe } from "@/lib/firebaseRecipes";

export default async function Home() {
  // Get all recipes from Firebase
  let featuredRecipes: Recipe[] = [];
  
  try {
    const allRecipes = await getAllRecipes();
    // Get 4 random recipes for featured section
    const shuffled = [...allRecipes].sort(() => Math.random() - 0.5);
    featuredRecipes = shuffled.slice(0, 4);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    // If Firebase isn't configured yet, show empty state
    featuredRecipes = [];
  }

  return (
    <main className="min-h-screen bg-primary-dark">
      <Header />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
     
            <h1 className="text-6xl font-bold text-text-color mb-4">
              Leona's Amazing Recipes
            </h1>
          </div>
          <p className="text-xl text-text-color mb-8 max-w-2xl mx-auto">
           Recipies that I've collected over the years!
          </p>
          <Link
            href="/recipes"
            className="inline-block bg-primary-dark text-text-color hover:text-secondary-dark px-10 py-4 rounded-full font-semibold"
          >
            Browse Recipes
          </Link>
        </div>
      </section>

      {/* Featured Recipes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="text-text-color text-2xl">✧</span>
            <h2 className="text-4xl font-bold text-text-color text-center">
              Featured Recipes
            </h2>
            <span className="text-text-color text-2xl">✧</span>
          </div>
          {featuredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredRecipes.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-color text-lg">No recipes available. Please configure Firebase to see recipes.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer Divider */}
      <div className="relative py-8 overflow-hidden mt-16">
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
      <footer className="text-text-color py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-text-color/90">
            © 2024 RecipeHub. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}

