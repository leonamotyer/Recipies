import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/app/components/header";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import EditRecipeForm from "@/app/components/editRecipeForm";

export const metadata: Metadata = {
  title: "Add Recipe | Leona's Recipes",
  description: "Add a new recipe to the collection",
};

export default function NewRecipePage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen">
        <Header />

        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="fade-up mb-6">
              <Link
                href="/recipes"
                className="btn-soft px-4 py-2 text-xs sm:text-sm"
              >
                ← Back to recipes
              </Link>
            </div>

            <div
              className="glass fade-up rounded-3xl p-5 sm:p-8 md:p-10"
              style={{ "--delay": "0.08s" } as React.CSSProperties}
            >
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-cocoa mb-8 text-center">
                Add a new <em className="gradient-text">recipe</em>
              </h1>
              <EditRecipeForm />
            </div>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
