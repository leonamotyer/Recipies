'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';
import { useState } from 'react';

interface ProtectedEditButtonProps {
  recipeId: string;
}

export default function ProtectedEditButton({ recipeId }: ProtectedEditButtonProps) {
  const { user, loading } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  if (loading) {
    return (
      <button
        disabled
        className="link-style-button font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3 opacity-50"
      >
        Loading...
      </button>
    );
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowLoginPrompt(true)}
          className="link-style-button font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
        >
          Edit Recipe
        </button>
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
              <h2 className="text-2xl font-bold text-text-color mb-4">Sign In Required</h2>
              <p className="text-text-color mb-6">
                You need to sign in with Google to edit recipes.
              </p>
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="filter-button px-4 py-2 rounded-full font-medium"
                >
                  Cancel
                </button>
                <Link
                  href="/login"
                  className="bg-secondary-dark text-white px-4 py-2 rounded-full font-medium hover:bg-secondary-dark/90"
                >
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <Link
      href={`/recipes/${recipeId}/edit`}
      className="link-style-button font-semibold text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
    >
      Edit Recipe
    </Link>
  );
}

