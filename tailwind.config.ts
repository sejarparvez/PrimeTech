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
        primary: {
          100: "#ffffff",
          200: "#09090b",
        },
        lightgray: {
          100: "#f4f4f5",
          200: "#39494b",
        },
        darkgray: {
          100: "#d0d0d1",
          200: "#27272a",
        },
        bdr: {
          100: "#e4e4e7",
          200: "#27272a",
        },
        txt: {
          100: "#6b6b6d",
          200: "#a1a1aa",
        },
        btn: {
          100: "#fafafa",
        },
      },
    },
  },
  plugins: [],
};
export default config;
