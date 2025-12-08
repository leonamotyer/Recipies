import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/app/components/header";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { getRecipeById } from "@/lib/firebaseRecipesRealtime";
import EditRecipeForm from "@/app/components/editRecipeForm";
import type { Recipe } from "@/lib/data.types";

interface EditRecipePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: EditRecipePageProps): Promise<Metadata> {
  const recipe = await getRecipeById(params.id);
  
  if (!recipe) {
    return {
      title: "Recipe Not Found | Leona's Recipes",
    };
  }
  
  return {
    title: `Edit ${recipe.title} | Leona's Recipes`,
    description: `Edit the recipe for ${recipe.title}`,
  };
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
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

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-primary-dark">
        <Header />

        <section className="py-8 sm:py-10 md:py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Back Button */}
            <div className="mb-4 sm:mb-6">
              <Link
                href={`/recipes/${params.id}`}
                className="inline-flex items-center text-text-color hover:text-secondary-dark font-medium text-sm sm:text-base"
              >
                ← Back to Recipe
              </Link>
            </div>

            {/* Edit Form */}
            <div className="bg-gray-300 rounded-2xl p-4 sm:p-6 md:p-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-color mb-6 sm:mb-8 text-center">
                Edit Recipe
              </h1>
              <EditRecipeForm recipe={recipe} />
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}

