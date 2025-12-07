import Link from "next/link";
import { Recipe } from "@/lib/firebaseRecipes";

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

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
  const displayCategory = recipe.categories && recipe.categories.length > 0 
    ? recipe.categories[0] 
    : "Recipe";

  return (
    <Link
      href={`/recipes/${recipe.id}`}
      className="bg-secondary-dark rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 block group"
    >
      {/* Image at the top */}
      <div className={`h-48 ${getBackgroundColor(index)}`}></div>
      
      {/* Content section with secondary-dark background */}
      <div className="p-6 bg-secondary-dark">
        {/* Title and cook time in right corner under the image */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-text-color group-hover:text-secondary-light flex-1 pr-2">
            {recipe.title}
          </h3>
          <span className="text-sm text-text-color font-medium whitespace-nowrap">
            {recipe.time}
          </span>
        </div>
        
        {/* Category badge */}
        {displayCategory && (
          <div className="mb-2">
            <span className="text-sm text-primary-dark font-semibold bg-third-light px-3 py-1 rounded-full">
              {displayCategory}
            </span>
          </div>
        )}
        
        {/* Description if available */}
        {recipe.description && (
          <p className="text-text-color mb-4 text-sm line-clamp-2">
            {recipe.description}
          </p>
        )}
      </div>
    </Link>
  );
}
