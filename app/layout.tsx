import type { Metadata } from "next";
import { Fraunces, Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Leona's Recipes",
  description: "Recipes that I've collected over the years!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${nunito.variable} font-body antialiased`}>
        {/* Soft bakery backdrop */}
        <div className="bakery-stage" aria-hidden="true">
          <div className="dough-blob dough-blob--blush" />
          <div className="dough-blob dough-blob--butter" />
          <div className="dough-blob dough-blob--pistachio" />
        </div>
        <div className="sprinkles" aria-hidden="true" />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
