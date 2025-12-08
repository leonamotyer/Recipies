import Link from "next/link";
import type { Recipe, RecipeCardProps } from "@/lib/data.types";


// Helper function to get background color based on index
const getBackgroundColor = (index: number) => {
  const colors = [
    'bg-primary-light',
    'bg-secondary-light',
    'bg-third-light',
    'bg-primary-dark/20',
  ];
  return colors[index % colors.length];
};

export default function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  // Get first category for display (or use "Recipe" as default)
  // Support both dishCategories (from Data Connect) and categories (computed alias)
  const categories = recipe.dishCategories || recipe.categories || [];
  const displayCategory = categories.length > 0 
    ? categories[0].charAt(0).toUpperCase() + categories[0].slice(1)
    : "Recipe";
  
  // Use computed time or format from cookTime
  const displayTime = recipe.time || (recipe.cookTime ? `${recipe.cookTime} min` : 'Time not specified');
  
  // Use description or cookingDescription
  const displayDescription = recipe.description || recipe.cookingDescription;

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="bg-third-light rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 block group"
    >
      {/* Image at the top */}
      <div className={`h-48 ${getBackgroundColor(index)}`}></div>
      
      {/* Content section with third-light background */}
      <div className="p-4 sm:p-5 md:p-6 bg-third-light">
        {/* Title and cook time in right corner under the image */}
        <div className="flex items-start justify-between mb-2 gap-2">
          <h3 className="text-lg sm:text-xl font-semibold text-text-color group-hover:text-secondary-light flex-1 pr-2 break-words">
            {recipe.title}
          </h3>
          <span className="text-xs sm:text-sm text-text-color font-medium whitespace-nowrap flex-shrink-0">
            {displayTime}
          </span>
        </div>
        
        {/* Category badge */}
        {displayCategory && (
          <div className="mb-2">
            <span className="text-xs sm:text-sm text-primary-dark font-semibold bg-third-light px-2 sm:px-3 py-1 rounded-full">
              {displayCategory}
            </span>
          </div>
        )}
        
        {/* Description if available */}
        {displayDescription && (
          <p className="text-text-color mb-4 text-xs sm:text-sm line-clamp-2">
            {displayDescription}
          </p>
        )}
      </div>
    </Link>
  );
}
