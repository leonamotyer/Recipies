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
    <div className="flex justify-center mt-10">
      <button
        onClick={handleRegenerate}
        disabled={isLoading}
        className="btn-soft px-7 py-3 text-sm sm:text-base disabled:opacity-50"
      >
        <span className={isLoading ? 'inline-block animate-spin' : 'inline-block'} aria-hidden>🎲</span>
        {isLoading ? 'Shuffling the deck...' : 'Deal me new recipes'}
      </button>
    </div>
  );
}

