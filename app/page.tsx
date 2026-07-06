import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/app/components/header";
import RecipeCard from "@/app/components/recipieCard";
import RegenerateButton from "@/app/components/regenerateButton";
import Reveal from "@/app/components/reveal";
import { getAllRecipes } from "@/lib/recipes";
import { unstable_cache } from "next/cache";
import type { Recipe } from "@/lib/data.types";

export const metadata: Metadata = {
  title: "Leona's Recipes",
  description: "Recipes that I've collected over the years!",
};

function getRandomRecipes(recipes: Recipe[], count: number): Recipe[] {
  const shuffled = [...recipes].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const getHomeData = unstable_cache(
  async () => {
    try {
      const allRecipes = await getAllRecipes();
      return {
        featured: getRandomRecipes(allRecipes, 4),
        titles: allRecipes.map((r) => r.displayTitle || r.title),
        total: allRecipes.length,
      };
    } catch (error) {
      console.error('Error fetching featured recipes:', error);
      return { featured: [] as Recipe[], titles: [] as string[], total: 0 };
    }
  },
  ['featured-recipes'],
  { revalidate: 3600 }
);

const floatingBits = [
  { emoji: "🥐", className: "left-[6%] top-[16%] text-4xl sm:text-5xl", delay: "0s" },
  { emoji: "🍓", className: "right-[8%] top-[12%] text-3xl sm:text-4xl", delay: "1.2s" },
  { emoji: "🧈", className: "left-[12%] bottom-[10%] text-3xl sm:text-4xl", delay: "2.1s" },
  { emoji: "🍪", className: "right-[13%] bottom-[18%] text-4xl sm:text-5xl", delay: "0.6s" },
  { emoji: "🌸", className: "left-[42%] top-[6%] text-2xl sm:text-3xl", delay: "1.8s" },
];

const cravings = [
  {
    emoji: "🍝",
    title: "Something hearty",
    blurb: "Mains and dinners that fill the whole house with good smells.",
    href: "/recipes?category=main course",
    direction: "left" as const,
  },
  {
    emoji: "🍰",
    title: "Something sweet",
    blurb: "Cakes, cookies, and desserts straight from the display case.",
    href: "/recipes?category=desert",
    direction: "up" as const,
  },
  {
    emoji: "⚡",
    title: "Something speedy",
    blurb: "On the table fast, for nights when the oven can't wait.",
    href: "/recipes?quick=true",
    direction: "right" as const,
  },
];

export default async function Home() {
  const { featured, titles, total } = await getHomeData();
  const tickerTitles = titles.length > 0 ? titles : ["Something delicious is rising"];

  return (
    <main className="min-h-screen">
      <Header />

      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden py-16 sm:py-24 md:py-28">
        {floatingBits.map((bit) => (
          <span
            key={bit.emoji}
            aria-hidden
            className={`float-slow pointer-events-none absolute select-none opacity-70 ${bit.className}`}
            style={{ "--delay": bit.delay } as React.CSSProperties}
          >
            {bit.emoji}
          </span>
        ))}

        <div className="container mx-auto px-4 text-center">
          {/* Steaming pie centerpiece */}
          <div className="fade-up relative mx-auto mb-6 inline-block">
            <span className="steam" aria-hidden>
              <span /><span /><span />
            </span>
            <span className="inline-block text-6xl sm:text-7xl drop-shadow-[0_10px_20px_rgba(201,138,75,0.3)]">
              🥧
            </span>
          </div>

          <p className="fade-up mb-5 text-xs sm:text-sm font-bold uppercase tracking-[0.35em] text-caramel" style={{ "--delay": "0.1s" } as React.CSSProperties}>
            ✦ fresh · warm · homemade ✦
          </p>
          <h1
            className="fade-up font-display text-balance text-5xl sm:text-7xl md:text-8xl leading-[1.02] text-cocoa"
            style={{ "--delay": "0.18s" } as React.CSSProperties}
          >
            A little bakery of
            <br />
            <em className="gradient-text">family recipes</em>
          </h1>
          <p
            className="fade-up mx-auto mt-6 max-w-xl text-base sm:text-lg text-latte leading-relaxed"
            style={{ "--delay": "0.3s" } as React.CSSProperties}
          >
            {total > 0 ? `${total} dishes` : "Dishes"} Leona has collected, cooked, and
            perfected over the years — wrapped up warm and ready to share.
          </p>
          <div
            className="fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
            style={{ "--delay": "0.42s" } as React.CSSProperties}
          >
            <Link href="/recipes" className="btn-sweet px-8 py-4 text-sm sm:text-base">
              Step inside <span aria-hidden>→</span>
            </Link>
            <a href="#journey" className="btn-soft px-8 py-4 text-sm sm:text-base">
              🧺 Take the tour
            </a>
          </div>
        </div>
      </section>

      {/* ===== Marquee ticker ===== */}
      <div className="marquee fade-up py-4" style={{ "--delay": "0.5s" } as React.CSSProperties}>
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="inline-flex items-center" aria-hidden={copy === 1}>
              {tickerTitles.map((title, i) => (
                <span
                  key={`${copy}-${i}`}
                  className="mx-5 inline-flex items-center gap-5 font-display italic text-xl sm:text-2xl text-cocoa/30"
                >
                  {title}
                  <span className="text-berry/50 not-italic text-sm">🥖</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ===== The journey ===== */}
      <section id="journey" className="journey-path mx-auto max-w-6xl px-4 pb-8 pt-16 sm:pt-20">
        {/* Stop 1 — pick your craving */}
        <div className="mb-20 sm:mb-28">
          <Reveal className="mb-10 flex flex-col items-center gap-4 text-center">
            <span className="journey-stop-badge wiggle">🧺</span>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.35em] text-caramel">
                First stop
              </span>
              <h2 className="font-display mt-1 text-3xl sm:text-4xl md:text-5xl text-cocoa">
                What are you <em className="gradient-text">craving</em>?
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
            {cravings.map((craving, i) => (
              <Reveal key={craving.title} direction={craving.direction} delay={i * 0.12}>
                <Link
                  href={craving.href}
                  className="spotlight-card jelly group block rounded-[1.75rem] p-7 text-center h-full"
                >
                  <span className="mb-4 inline-block text-5xl transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-6">
                    {craving.emoji}
                  </span>
                  <h3 className="font-display text-2xl text-cocoa group-hover:text-berry transition-colors">
                    {craving.title}
                  </h3>
                  <p className="mt-2 text-sm text-latte leading-relaxed">{craving.blurb}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Stop 2 — fresh from the oven */}
        {featured.length > 0 && (
          <div className="mb-20 sm:mb-28">
            <Reveal className="mb-10 flex flex-col items-center gap-4 text-center">
              <span className="journey-stop-badge wiggle">🔥</span>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.35em] text-caramel">
                  Second stop
                </span>
                <h2 className="font-display mt-1 text-3xl sm:text-4xl md:text-5xl text-cocoa">
                  Fresh from <em className="gradient-text">the oven</em>
                </h2>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {featured.map((recipe, index) => (
                <Reveal key={recipe.id} delay={index * 0.12}>
                  <RecipeCard recipe={recipe} index={index} />
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <RegenerateButton />
            </Reveal>
          </div>
        )}

        {/* Stop 3 — the whole pantry */}
        <div className="pb-12">
          <Reveal className="flex flex-col items-center gap-4 text-center">
            <span className="journey-stop-badge wiggle">💝</span>
            <div className="glass mx-auto max-w-2xl rounded-[2rem] px-8 py-10 sm:px-12">
              <h2 className="font-display text-3xl sm:text-4xl text-cocoa">
                Take the whole <em className="gradient-text">recipe box</em>
              </h2>
              <p className="mx-auto mt-4 max-w-md text-latte leading-relaxed">
                Every dish in the collection — searchable, filterable, and waiting
                for someone to cook it tonight.
              </p>
              <Link href="/recipes" className="btn-sweet mt-8 px-8 py-4 text-sm sm:text-base">
                Browse all {total > 0 ? total : ""} recipes <span aria-hidden>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Empty state */}
      {featured.length === 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="glass mx-auto max-w-md rounded-3xl p-10">
              <p className="text-4xl mb-4">🍞</p>
              <p className="text-latte text-lg">
                No recipes available. Please configure Firebase to see recipes.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ===== Footer ===== */}
      <footer className="pb-10 pt-6">
        <div className="piping-divider mx-auto mb-8 max-w-4xl" />
        <div className="container mx-auto px-4 text-center">
          <p className="font-display italic text-lg text-cocoa/75">
            Baked with butter, sugar &amp; love 🧁
          </p>
          <p className="mt-2 text-sm text-latte">
            © {new Date().getFullYear()} Leona&apos;s Kitchen. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
