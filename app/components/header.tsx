import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <>
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-3 sm:px-4 py-2 sm:py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="inline-block flex-shrink-0">
              <Image 
                src="/whisk-svgrepo-com.svg" 
                alt="Leona's Recipies" 
                width={60} 
                height={60} 
                className="h-8 sm:h-10 md:h-12 w-auto"
                priority
              />
            </Link>
            <div className="flex gap-1 sm:gap-2 md:gap-4 flex-wrap text-xs sm:text-sm md:text-base justify-end">
              <Link 
                href="/recipes" 
                className="text-text-color hover:text-secondary-dark font-medium px-2 sm:px-3 py-1 rounded-full hover:bg-primary-dark/10"
              >
                All
              </Link>
              <Link 
                href="/recipes?category=main course" 
                className="text-text-color hover:text-secondary-dark font-medium px-2 sm:px-3 py-1 rounded-full hover:bg-primary-dark/10"
              >
                Mains
              </Link>
              <Link 
                href="/recipes?category=desert" 
                className="text-text-color hover:text-secondary-dark font-medium px-2 sm:px-3 py-1 rounded-full hover:bg-primary-dark/10"
              >
                Desserts
              </Link>
              <a 
                href="https://motyer.ca" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-color hover:text-secondary-dark font-medium px-2 sm:px-3 py-1 rounded-full hover:bg-primary-dark/10"
              >
                About
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Elegant Flourish Divider under Header */}
      <div className="relative py-2 sm:py-3 md:py-4 overflow-hidden">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Image 
            src="/Elegant-Flourish-Frame-Extrapolated-19.svg" 
            alt="Elegant Flourish Divider" 
            width={1200} 
            height={200} 
            className="w-full max-w-5xl h-auto"
          />
        </div>
      </div>
    </>
  );
}
