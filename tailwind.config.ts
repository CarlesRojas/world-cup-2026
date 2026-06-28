import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        pitch: {
          900: "#0a1f14",
          800: "#0f2c1c",
          700: "#15452b",
        },
      },
    },
  },
  plugins: [],
};

export default config;
