import { Suspense } from "react";
import Link from "next/link";
import Header from "@/app/components/header";
import Filters from "@/app/components/filters";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-primary-dark">
      <Header />
      <Suspense fallback={<div className="bg-primary-dark/80 backdrop-blur-sm z-40 shadow-sm"><div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4"><div className="h-16 sm:h-20"></div></div></div>}>
        <Filters />
      </Suspense>

      <section className="py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-color mb-6 sm:mb-8 text-center px-4">About RecipeHub</h1>
          
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 sm:space-y-6">
            <p className="text-base sm:text-lg text-text-color leading-relaxed">
              Welcome to RecipeHub, your go-to destination for discovering and sharing
              amazing recipes from around the world. Whether you&apos;re a seasoned chef or
              just starting your culinary journey, we have something for everyone.
            </p>
            
            <p className="text-base sm:text-lg text-text-color leading-relaxed">
              Our mission is to make cooking accessible, enjoyable, and inspiring. We
              believe that great food brings people together and creates lasting memories.
            </p>

            <h2 className="text-2xl sm:text-3xl font-semibold text-text-color mt-6 sm:mt-8 mb-4 sm:mb-6">
              What We Offer
            </h2>
            <ul className="space-y-3 sm:space-y-4 text-text-color">
              <li className="flex items-start gap-3">
                <span className="text-base sm:text-lg">Curated collection of delicious recipes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-base sm:text-lg">Easy-to-follow instructions for all skill levels</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-base sm:text-lg">Recipes for every occasion and dietary preference</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

