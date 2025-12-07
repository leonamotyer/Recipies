import Link from "next/link";
import Header from "@/app/components/header";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-primary-dark">
      <Header />

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-5xl font-bold text-text-color mb-8 text-center">About RecipeHub</h1>
          
          <div className="bg-white rounded-2xl p-10 space-y-6">
            <p className="text-lg text-text-color leading-relaxed">
              Welcome to RecipeHub, your go-to destination for discovering and sharing
              amazing recipes from around the world. Whether you're a seasoned chef or
              just starting your culinary journey, we have something for everyone.
            </p>
            
            <p className="text-lg text-text-color leading-relaxed">
              Our mission is to make cooking accessible, enjoyable, and inspiring. We
              believe that great food brings people together and creates lasting memories.
            </p>

            <h2 className="text-3xl font-semibold text-text-color mt-8 mb-6">
              What We Offer
            </h2>
            <ul className="space-y-4 text-text-color">
              <li className="flex items-start gap-3">
                <span className="text-lg">Curated collection of delicious recipes</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">Easy-to-follow instructions for all skill levels</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">Recipes for every occasion and dietary preference</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}

