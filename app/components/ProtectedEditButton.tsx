'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';
import { useState } from 'react';

interface ProtectedEditButtonProps {
  recipeId: string;
}

export default function ProtectedEditButton({ recipeId }: ProtectedEditButtonProps) {
  const { user, loading, isAdmin } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  if (loading) {
    return (
      <button disabled className="btn-soft px-4 py-2 text-xs sm:text-sm opacity-50">
        Loading...
      </button>
    );
  }

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowLoginPrompt(true)}
          className="btn-soft px-4 py-2 text-xs sm:text-sm"
        >
          ✎ Edit recipe
        </button>
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="glass-strong rounded-3xl p-8 max-w-md mx-4 fade-up">
              <h2 className="font-display text-2xl sm:text-3xl text-cocoa mb-3">Sign in required</h2>
              <p className="text-latte mb-8">
                You need to sign in with Google to edit recipes.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="btn-soft px-5 py-2.5 text-sm"
                >
                  Cancel
                </button>
                <Link href="/login" className="btn-sweet px-5 py-2.5 text-sm">
                  Go to login
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Signed in but not the admin: editing is not available
  if (!isAdmin) {
    return null;
  }

  return (
    <Link
      href={`/recipes/${recipeId}/edit`}
      className="btn-soft px-4 py-2 text-xs sm:text-sm"
    >
      ✎ Edit recipe
    </Link>
  );
}

