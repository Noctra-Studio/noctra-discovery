import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#080808",
        white: "#F5F5F0",
        gray: {
          1: "#141414",
          2: "#222222",
          3: "#555555",
        },
        accent: "#00E5A0",
      },
      fontFamily: {
        display: ["var(--font-satoshi)", "sans-serif"],
        body: ["var(--font-satoshi)", "sans-serif"],
        sans: ["var(--font-satoshi)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
