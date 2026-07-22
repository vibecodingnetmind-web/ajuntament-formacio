import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "Helvetica", "Arial", "sans-serif"],
      },
      colors: {
        // Gencat institutional colors
        gencat: {
          red: "#ED1C24",
          "red-75": "#F0555C",
          "red-50": "#F58E92",
          "red-25": "#FAC6C9",
          "red-10": "#FDE8E9",
        },
        gray: {
          50: "#F5F5F5",
          100: "#E5E5E5",
          200: "#DDDDDD",
          400: "#999999",
          600: "#666666",
          800: "#333333",
          900: "#171717",
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
