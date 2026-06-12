'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/app/contexts/AuthContext';
import { uploadRecipeImage } from '@/lib/firebaseStorage';
import { updateRecipe } from '@/lib/firebaseRecipesRealtime';
import { revalidateRecipePaths } from '@/app/actions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Recipe, Image as RecipeImage } from '@/lib/data.types';

interface AddPhotoButtonProps {
  recipe: Recipe;
}

export default function AddPhotoButton({ recipe }: AddPhotoButtonProps) {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Only the admin can upload photos (enforced by Firebase rules too)
  if (!user || !isAdmin) {
    return null;
  }

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
      
      // Get existing images with their metadata
      const existingImages = recipe.images || [];
      
      // Create new image object with uploader email
      const newImage: RecipeImage = {
        id: `img-${Date.now()}`,
        imageUrl: imageUrl,
        uploadedBy: user.email || undefined,
      };
      
      // Combine existing images with new one
      const updatedImages = [...existingImages, newImage];

      // Write directly from the browser so the request carries the
      // signed-in user's credentials (database rules require auth to write)
      const updated = await updateRecipe(recipe.id, {
        images: updatedImages,
      });

      if (updated) {
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        // Refresh the server-rendered page to show the new image
        await revalidateRecipePaths(recipe.id);
        router.refresh();
      } else {
        setError('Recipe not found');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload image';
      setError(
        message.toLowerCase().includes('permission')
          ? 'Permission denied. Please make sure you are signed in with Google.'
          : message
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mb-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={isUploading}
        className="hidden"
        id="add-photo-upload"
      />
      <label
        htmlFor="add-photo-upload"
        className={`filter-button inline-block px-4 py-2 rounded-full font-medium cursor-pointer ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isUploading ? 'Uploading...' : '+ Add Photo'}
      </label>
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}

