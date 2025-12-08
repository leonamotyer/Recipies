'use client';

import { useState, FormEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { updateRecipeAction } from '@/app/actions';
import { uploadRecipeImage } from '@/lib/firebaseStorage';
import type { Recipe, Ingredient, Image as RecipeImage } from '@/lib/data.types';

interface EditRecipeFormProps {
  recipe: Recipe;
}

export default function EditRecipeForm({ recipe }: EditRecipeFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState(recipe.title);
  const [cookTime, setCookTime] = useState(recipe.cookTime || 0);
  const [cookingDescription, setCookingDescription] = useState(recipe.cookingDescription || '');
  const [dishCategories, setDishCategories] = useState<string[]>(recipe.dishCategories || []);
  const [ingredients, setIngredients] = useState<Ingredient[]>(recipe.ingredients || []);
  const [images, setImages] = useState<string[]>(recipe.images?.map(img => img.imageUrl) || []);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available categories
  const availableCategories = [
    'dinner', 'lunch', 'breakfast', 'main course', 'dessert', 'desert',
    'appetizer', 'side', 'snack', 'fancy', 'quick', 'cheap', 'one pan'
  ];

  const handleCategoryToggle = (category: string) => {
    setDishCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(cat => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleAddIngredient = () => {
    setIngredients(prev => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        recipeId: recipe.id,
        ingredientName: '',
        measurement: '',
      }
    ]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: 'ingredientName' | 'measurement', value: string) => {
    setIngredients(prev => prev.map((ing, i) => 
      i === index ? { ...ing, [field]: value } : ing
    ));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const imageUrl = await uploadRecipeImage(file, recipe.id);
      setImages(prev => [...prev, imageUrl]);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Filter out empty ingredients
      const validIngredients = ingredients.filter(
        ing => ing.ingredientName.trim() && ing.measurement.trim()
      );

      // Convert image URLs to Image objects
      const imageObjects: RecipeImage[] = images.map((url, index) => ({
        id: `img-${index}`,
        imageUrl: url,
      }));

      const result = await updateRecipeAction(recipe.id, {
        title,
        cookTime: cookTime || 0,
        cookingDescription,
        dishCategories,
        ingredients: validIngredients,
        images: imageObjects,
      });

      if (result.success) {
        router.push(`/recipes/${recipe.id}`);
        router.refresh();
      } else {
        setError(result.error || 'Failed to update recipe');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-text-color font-semibold mb-2">
          Title *
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="filter-input w-full px-4 py-2 rounded-lg text-text-color"
        />
      </div>

      {/* Cook Time */}
      <div>
        <label htmlFor="cookTime" className="block text-text-color font-semibold mb-2">
          Cook Time (minutes)
        </label>
        <input
          type="number"
          id="cookTime"
          value={cookTime}
          onChange={(e) => setCookTime(parseInt(e.target.value) || 0)}
          min="0"
          className="filter-input w-full px-4 py-2 rounded-lg text-text-color"
        />
      </div>

      {/* Cooking Description */}
      <div>
        <label htmlFor="cookingDescription" className="block text-text-color font-semibold mb-2">
          Instructions *
        </label>
        <textarea
          id="cookingDescription"
          value={cookingDescription}
          onChange={(e) => setCookingDescription(e.target.value)}
          required
          rows={8}
          className="filter-input w-full px-4 py-2 rounded-lg text-text-color resize-y"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="block text-text-color font-semibold mb-2">
          Categories
        </label>
        <div className="flex flex-wrap gap-2">
          {availableCategories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleCategoryToggle(category)}
              className={`filter-button px-4 py-2 rounded-full font-medium ${
                dishCategories.includes(category) ? 'active' : ''
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <label className="block text-text-color font-semibold mb-2">
          Images
        </label>
        <div className="space-y-4">
          {/* Upload Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`filter-button inline-block px-4 py-2 rounded-full font-medium cursor-pointer ${
                isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? 'Uploading...' : '+ Upload Image'}
            </label>
          </div>

          {/* Image Preview Grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={imageUrl}
                      alt={`Recipe image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ingredients */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-text-color font-semibold">
            Ingredients
          </label>
          <button
            type="button"
            onClick={handleAddIngredient}
            className="filter-button px-4 py-2 rounded-full font-medium text-sm"
          >
            + Add Ingredient
          </button>
        </div>
        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div key={ingredient.id || index} className="flex gap-2 items-start">
              <input
                type="text"
                placeholder="Ingredient name"
                value={ingredient.ingredientName}
                onChange={(e) => handleIngredientChange(index, 'ingredientName', e.target.value)}
                className="filter-input flex-1 px-4 py-2 rounded-lg text-text-color"
              />
              <input
                type="text"
                placeholder="Measurement"
                value={ingredient.measurement}
                onChange={(e) => handleIngredientChange(index, 'measurement', e.target.value)}
                className="filter-input flex-1 px-4 py-2 rounded-lg text-text-color"
              />
              <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
                className="filter-button px-4 py-2 rounded-lg font-medium"
              >
                Remove
              </button>
            </div>
          ))}
          {ingredients.length === 0 && (
            <p className="text-text-color/70 text-sm">No ingredients added. Click &quot;+ Add Ingredient&quot; to add one.</p>
          )}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 justify-end pt-4">
        <Link
          href={`/recipes/${recipe.id}`}
          className="filter-button px-6 py-3 rounded-full font-semibold"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-secondary-dark text-white px-6 py-3 rounded-full font-semibold hover:bg-secondary-dark/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

