import Header from '@/app/components/header';
import LoginButton from '@/app/components/LoginButton';
import { AuthProvider } from '@/app/contexts/AuthContext';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sign In | Leona's Recipes",
  description: "Sign in to edit recipes",
};

export default function LoginPage() {
  return (
    <AuthProvider>
      <main className="min-h-screen bg-primary-dark">
        <Header />
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-md">
            <div className="bg-gray-300 rounded-2xl p-6 sm:p-8 md:p-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-text-color mb-6 text-center">
                Sign In
              </h1>
              <p className="text-text-color mb-8 text-center">
                Sign in with Google to edit recipes
              </p>
              <div className="flex justify-center">
                <LoginButton />
              </div>
            </div>
          </div>
        </section>
      </main>
    </AuthProvider>
  );
}

