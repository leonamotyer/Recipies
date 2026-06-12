import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import Header from "@/app/components/header";
import ProtectedEditButton from "@/app/components/ProtectedEditButton";
import AddPhotoButton from "@/app/components/AddPhotoButton";
import IngredientChecklist from "@/app/components/ingredientChecklist";
import { getRecipeById } from "@/lib/firebaseRecipesRealtime";
import { GRANDMA_RIPLEY_TAG } from "@/lib/grandmaRipley";
import type { Recipe } from "@/lib/data.types";

interface RecipePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { id } = await params;
  const recipe = await getRecipeById(id);
  
  if (!recipe) {
    return {
      title: "Recipe Not Found | Leona's Recipes",
    };
  }
  
  return {
    title: `${recipe.displayTitle || recipe.title} | Leona's Recipes`,
    description: recipe.description || recipe.cookingDescription || `View the recipe for ${recipe.displayTitle || recipe.title}`,
  };
}

/** Split free-form instructions into displayable steps */
function toSteps(text: string): string[] {
  return text
    .split(/\r?\n+/)
    .map((line) => line.replace(/^\s*(\d+[.)]|[-*•])\s*/, "").trim())
    .filter((line) => line.length > 0);
}

export default async function RecipePage({ params }: RecipePageProps) {
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

  const displayTitle = recipe.displayTitle || recipe.title;
  const hasValidTime = recipe.cookTime && recipe.cookTime > 0;
  const displayTime = hasValidTime ? (recipe.time || `${recipe.cookTime} min`) : null;
  const categories = recipe.dishCategories || recipe.categories || [];
  const steps = recipe.cookingDescription ? toSteps(recipe.cookingDescription) : [];
  const heroImage = recipe.images?.[0]?.imageUrl;

  return (
    <main className="min-h-screen">
      <Header />

      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Top row */}
          <div className="fade-up mb-6 flex items-center justify-between">
            <Link
              href="/recipes"
              className="btn-soft px-4 py-2 text-xs sm:text-sm"
            >
              ← All recipes
            </Link>
            <ProtectedEditButton recipeId={id} />
          </div>

          {/* Hero */}
          <div className="fade-up relative mb-10 overflow-hidden rounded-[2rem] glass" style={{ "--delay": "0.05s" } as React.CSSProperties}>
            {heroImage && (
              <>
                <Image
                  src={heroImage}
                  alt={displayTitle}
                  fill
                  className="object-cover opacity-30"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fffdf9f5] via-[#fffdf9cc] to-[#fffdf966]" />
              </>
            )}
            <div className="relative px-6 py-14 sm:px-12 sm:py-20 text-center">
              {(recipe.grandmaRipley || categories.length > 0) && (
                <div className="mb-5 flex flex-wrap justify-center gap-2">
                  {recipe.grandmaRipley && (
                    <span className="chip chip--jam">{GRANDMA_RIPLEY_TAG}</span>
                  )}
                  {categories.map((cat, index) => (
                    <span key={index} className="chip">
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="font-display text-balance text-4xl sm:text-6xl md:text-7xl leading-[1.05] text-cocoa break-words">
                <em className="gradient-text">{displayTitle}</em>
              </h1>
              {displayTime && (
                <p className="mt-5 inline-flex items-center gap-2 text-sm sm:text-base font-semibold uppercase tracking-[0.25em] text-berry">
                  ⏱ {displayTime}
                </p>
              )}
            </div>
          </div>

          {/* Ingredients + Photos side by side on desktop */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5 mb-6">
            {/* Ingredients */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <div
                className="glass fade-up rounded-3xl p-6 sm:p-8 lg:col-span-2 lg:sticky lg:top-24 self-start"
                style={{ "--delay": "0.1s" } as React.CSSProperties}
              >
                <h2 className="font-display text-2xl sm:text-3xl text-cocoa mb-5">
                  Ingredients
                </h2>
                <IngredientChecklist ingredients={recipe.ingredients} />
              </div>
            )}

            {/* Instructions */}
            {steps.length > 0 && (
              <div
                className={`glass fade-up rounded-3xl p-6 sm:p-8 ${recipe.ingredients && recipe.ingredients.length > 0 ? 'lg:col-span-3' : 'lg:col-span-5'}`}
                style={{ "--delay": "0.18s" } as React.CSSProperties}
              >
                <h2 className="font-display text-2xl sm:text-3xl text-cocoa mb-6">
                  Instructions
                </h2>
                {steps.length > 1 ? (
                  <ol className="space-y-6">
                    {steps.map((step, index) => (
                      <li key={index} className="flex gap-4 sm:gap-5">
                        <span className="step-number text-3xl sm:text-4xl leading-none w-10 flex-shrink-0 text-right">
                          {index + 1}
                        </span>
                        <p className="flex-1 text-base sm:text-lg leading-relaxed text-cocoa/85 pt-0.5">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="whitespace-pre-line text-base sm:text-lg leading-relaxed text-cocoa/85">
                    {recipe.cookingDescription}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Photos */}
          <div
            className="glass fade-up rounded-3xl p-6 sm:p-8"
            style={{ "--delay": "0.26s" } as React.CSSProperties}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-2xl sm:text-3xl text-cocoa">Gallery</h2>
              <AddPhotoButton recipe={recipe} />
            </div>
            {recipe.images && recipe.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 sm:gap-4">
                {recipe.images.map((image, index) => (
                  <div
                    key={image.id || index}
                    className="group relative aspect-square overflow-hidden rounded-2xl border border-white/10"
                  >
                    <Image
                      src={image.imageUrl}
                      alt={`${displayTitle} - Photo ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                    {image.uploadedBy && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/70 px-2 py-1 text-xs text-white/90 opacity-0 transition-opacity group-hover:opacity-100">
                        📷 {image.uploadedBy}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-latte">
                No photos yet — this dish is still camera shy.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
