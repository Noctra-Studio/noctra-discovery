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
        sans: ["Satoshi", "sans-serif"],
        display: ["Satoshi", "sans-serif"],
        body: ["Satoshi", "sans-serif"],
        mono: ["Satoshi", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
