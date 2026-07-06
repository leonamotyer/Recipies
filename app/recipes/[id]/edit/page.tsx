import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/app/components/header";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { getRecipeById } from "@/lib/recipes";
import EditRecipeForm from "@/app/components/editRecipeForm";
import type { Recipe } from "@/lib/data.types";

interface EditRecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditRecipePageProps): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipeById(id);
  
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
  const { id } = await params;
  const recipe: Recipe | null = await getRecipeById(id);

  if (!recipe) {
    return (
      <main className="min-h-screen">
        <Header />
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="glass fade-up mx-auto max-w-md rounded-3xl p-12 text-center">
              <p className="mb-4 text-5xl">🫥</p>
              <h1 className="font-display text-3xl text-cocoa mb-2">Recipe not found</h1>
              <p className="text-latte mb-8">The recipe you&apos;re looking for doesn&apos;t exist.</p>
              <Link href="/recipes" className="btn-sweet px-6 py-3 text-sm">
                Back to recipes
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen">
        <Header />

        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Back Button */}
            <div className="fade-up mb-6">
              <Link
                href={`/recipes/${id}`}
                className="btn-soft px-4 py-2 text-xs sm:text-sm"
              >
                ← Back to recipe
              </Link>
            </div>

            {/* Edit Form */}
            <div className="glass fade-up rounded-3xl p-5 sm:p-8 md:p-10" style={{ "--delay": "0.08s" } as React.CSSProperties}>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-cocoa mb-8 text-center">
                Edit <em className="gradient-text">{recipe.title}</em>
              </h1>
              <EditRecipeForm recipe={recipe} />
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}

