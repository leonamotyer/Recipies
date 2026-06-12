'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import Link from 'next/link';

export default function ProtectedAddButton() {
  const { user, loading, isAdmin } = useAuth();

  if (loading || !user || !isAdmin) {
    return null;
  }

  return (
    <Link
      href="/recipes/new"
      className="rounded-full px-2.5 sm:px-4 py-1.5 font-semibold text-cocoa/75 transition-all hover:text-berry hover:bg-blush/25"
    >
      + Add
    </Link>
  );
}
