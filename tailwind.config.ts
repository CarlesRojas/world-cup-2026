import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        // Minimalist neutral palette — near-black ink on white, hairline borders.
        ink: {
          DEFAULT: "#0a0a0a",
          muted: "#52525b",
          faint: "#a1a1aa",
        },
        line: "#e7e7e9",
      },
    },
  },
  plugins: [],
};

export default config;
