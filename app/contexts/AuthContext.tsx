'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, signInWithGoogle, signOutUser } from '@/lib/firebaseAuth';

/** Email address with admin (edit) access. Must match database.rules.json and storage.rules. */
export const ADMIN_EMAIL = 'rlmotyer@gmail.com';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  /** True when the signed-in user is the admin allowed to edit recipes */
  isAdmin: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const result = await signInWithGoogle();
    if (result.error) {
      throw new Error(result.error);
    }
  };

  const signOut = async () => {
    const result = await signOutUser();
    if (result.error) {
      throw new Error(result.error);
    }
  };

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

