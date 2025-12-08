'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { regenerateFeaturedRecipes } from '@/app/actions';

export default function RegenerateButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegenerate = async () => {
    setIsLoading(true);
    try {
      await regenerateFeaturedRecipes();
      router.refresh();
    } catch (error) {
      console.error('Error regenerating recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center mt-6 sm:mt-8">
      <button
        onClick={handleRegenerate}
        disabled={isLoading}
        className="link-style-button font-semibold text-sm sm:text-base px-6 sm:px-8 py-2 sm:py-3"
      >
        {isLoading ? 'Regenerating...' : 'Get New Recipes'}
      </button>
    </div>
  );
}

