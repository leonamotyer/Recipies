import Link from "next/link";
import Image from "next/image";
import ProtectedAddButton from "@/app/components/ProtectedAddButton";

const navLinks = [
  { href: "/recipes", label: "All" },
  { href: "/recipes?category=main course", label: "Mains" },
  { href: "/recipes?category=desert", label: "Desserts" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
      <nav className="glass-strong mx-auto max-w-5xl rounded-full px-4 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="group flex items-center gap-2.5 flex-shrink-0">
            <span className="jelly grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-gradient-to-br from-blush via-[#f3a9bd] to-butter shadow-[0_4px_14px_-4px_rgba(226,109,143,0.6)] transition-transform duration-500 group-hover:rotate-[20deg]">
              <Image
                src="/whisk-svgrepo-com.svg"
                alt=""
                width={22}
                height={22}
                className="h-5 w-5 sm:h-6 sm:w-6"
                priority
              />
            </span>
            <span className="font-display italic text-base sm:text-lg text-cocoa tracking-wide hidden xs:inline sm:inline">
              Leona&apos;s Kitchen
            </span>
          </Link>

          <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="rounded-full px-2.5 sm:px-4 py-1.5 font-semibold text-cocoa/75 transition-all hover:text-berry hover:bg-blush/25"
              >
                {link.label}
              </Link>
            ))}
            <ProtectedAddButton />
            <a
              href="https://motyer.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full px-2.5 sm:px-4 py-1.5 font-semibold text-cocoa/75 transition-all hover:text-berry hover:bg-blush/25"
            >
              About
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
