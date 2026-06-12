'use client';

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import type { RecipeCardProps } from "@/lib/data.types";
import { GRANDMA_RIPLEY_TAG } from "@/lib/grandmaRipley";

const categoryEmoji = (categories: string[]): string => {
  const joined = categories.join(" ").toLowerCase();
  if (joined.includes("desert") || joined.includes("dessert")) return "🧁";
  if (joined.includes("breakfast")) return "🥞";
  if (joined.includes("lunch")) return "🥪";
  if (joined.includes("appetizer")) return "🫒";
  if (joined.includes("side")) return "🥗";
  if (joined.includes("snack")) return "🍿";
  if (joined.includes("soup")) return "🍜";
  return "🥧";
};

const placeholderGradients = [
  "from-[#fde7ee] via-[#fdf2e3] to-[#fffdf9]",
  "from-[#fdf0dc] via-[#fdeae2] to-[#fffdf9]",
  "from-[#e9f2e2] via-[#fdf4e3] to-[#fffdf9]",
  "from-[#fdeee4] via-[#fde9f0] to-[#fffdf9]",
];

export default function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  const categories = recipe.dishCategories || recipe.categories || [];
  const displayCategory =
    categories.length > 0
      ? categories[0].charAt(0).toUpperCase() + categories[0].slice(1)
      : null;

  const displayTitle = recipe.displayTitle || recipe.title;
  const hasValidTime = recipe.cookTime && recipe.cookTime > 0;
  const displayTime = hasValidTime ? recipe.time || `${recipe.cookTime} min` : null;
  const displayDescription = recipe.description || recipe.cookingDescription;
  const coverImage = recipe.images?.[0]?.imageUrl;

  return (
    <Link
      ref={cardRef}
      href={`/recipes/${recipe.id}`}
      onMouseMove={handleMouseMove}
      className="spotlight-card group block rounded-[1.75rem]"
    >
      {/* Cover */}
      <div className="relative h-52 overflow-hidden">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={displayTitle}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${placeholderGradients[index % placeholderGradients.length]}`}
          >
            <span className="text-6xl drop-shadow-[0_8px_16px_rgba(201,138,75,0.25)] transition-transform duration-700 group-hover:scale-125 group-hover:-rotate-6">
              {categoryEmoji(categories)}
            </span>
          </div>
        )}

        {displayTime && (
          <span className="chip chip--jam absolute right-3 top-3 z-10">
            ⏱ {displayTime}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="relative z-10 p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {recipe.grandmaRipley && <span className="chip chip--jam">{GRANDMA_RIPLEY_TAG}</span>}
          {displayCategory && <span className="chip">{displayCategory}</span>}
        </div>
        <h3 className="font-display text-xl sm:text-2xl text-cocoa leading-snug break-words transition-colors duration-300 group-hover:text-berry">
          {displayTitle}
        </h3>
        {displayDescription && (
          <p className="mt-2 text-sm text-latte line-clamp-2 leading-relaxed">
            {displayDescription}
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-berry opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          Bake it <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
