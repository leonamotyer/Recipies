'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-latte text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-3xl p-10 max-w-md mx-4 text-center fade-up">
          <h1 className="font-display text-3xl text-cocoa mb-3">Sign in required</h1>
          <p className="text-latte mb-8">
            You need to sign in with Google to access this page.
          </p>
          <Link href="/login" className="btn-sweet px-6 py-3 text-sm inline-flex">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-3xl p-10 max-w-md mx-4 text-center fade-up">
          <h1 className="font-display text-3xl text-cocoa mb-3">Admin access only</h1>
          <p className="text-latte mb-8">
            Only the site admin can edit recipes. You are signed in as {user.email}.
          </p>
          <Link href="/recipes" className="btn-sweet px-6 py-3 text-sm inline-flex">
            Back to recipes
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

