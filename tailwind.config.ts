import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "primary-light": "var(--primary-light)",
        "secondary-light": "var(--secondary-light)",
        "primary-dark": "var(--primary-dark)",
        "secondary-dark": "var(--secondary-dark)",
        "third-light": "var(--third-light)",
        black: "var(--black)",
        white: "var(--white)",
        "text-color": "var(--text-color)",
        "link-color": "var(--link-color)",
      },
    },
  },
  plugins: [],
};
export default config;

