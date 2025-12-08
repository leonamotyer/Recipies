'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-text-color text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="bg-gray-300 rounded-2xl p-8 max-w-md mx-4 text-center">
          <h1 className="text-2xl font-bold text-text-color mb-4">Sign In Required</h1>
          <p className="text-text-color mb-6">
            You need to sign in with Google to access this page.
          </p>
          <Link
            href="/login"
            className="bg-secondary-dark text-white px-6 py-3 rounded-full font-semibold hover:bg-secondary-dark/90 inline-block"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

