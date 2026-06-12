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
        paper: "var(--paper)",
        "paper-deep": "var(--paper-deep)",
        card: "var(--card)",
        crust: "var(--crust)",
        cocoa: "var(--cocoa)",
        latte: "var(--latte)",
        berry: "var(--berry)",
        blush: "var(--blush)",
        butter: "var(--butter)",
        caramel: "var(--caramel)",
        pistachio: "var(--pistachio)",
        rose: "var(--rose)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
