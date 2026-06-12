import Header from '@/app/components/header';
import LoginButton from '@/app/components/LoginButton';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sign In | Leona's Recipes",
  description: "Sign in to edit recipes",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 max-w-md">
          <div className="glass fade-up rounded-3xl p-8 sm:p-10 text-center">
            <span className="jelly mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-blush via-[#f3a9bd] to-butter text-3xl shadow-[0_8px_24px_-8px_rgba(226,109,143,0.6)]">
              🔑
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-cocoa mb-3">
              Welcome <em className="gradient-text">back</em>
            </h1>
            <p className="text-latte mb-8">
              Sign in with Google to edit recipes and add photos.
            </p>
            <div className="flex justify-center">
              <LoginButton />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
