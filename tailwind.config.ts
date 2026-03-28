import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"]
      },
      colors: {
        surface: {
          900: "#050609",
          800: "#0a0d12",
          700: "#111725"
        },
        accent: {
          blue: "#3ba5ff",
          violet: "#7b66ff",
          mint: "#53f0dd"
        }
      },
      boxShadow: {
        hero: "0 24px 70px rgba(0,0,0,0.55)",
        glow: "0 0 30px rgba(59,165,255,0.35)"
      }
    }
  },
  plugins: []
};

export default config;
