import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: "#0FA37F",
          50: "#e6f9f5",
          100: "#ccf3ea",
          200: "#99e7d5",
          300: "#66dbc0",
          400: "#33cfab",
          500: "#0FA37F",
          600: "#0c8267",
          700: "#09624e",
          800: "#064135",
          900: "#03211b",
        },
        dash: {
          bg: "#f4f6f8",
          surface: "#ffffff",
          border: "#e8ebef",
          sidebar: "#0b1f22",
          "sidebar-hover": "#13312f",
          "sidebar-muted": "#8aa0a0",
          brand: "#0FA37F",
          "brand-dark": "#0c8267",
          "hero-from": "#0b3b35",
          "hero-via": "#0f5246",
          "hero-to": "#157a64",
          ink: "#0f1f24",
          muted: "#6b7785",
          positive: "#10b981",
        },
      },
      borderRadius: {
        dash: "1rem",
        "dash-lg": "1.25rem",
      },
      boxShadow: {
        dash: "0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)",
        "dash-md": "0 4px 16px rgba(16, 24, 40, 0.08)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        geist: ["var(--font-geist-sans)", "sans-serif"],
        "geist-mono": ["var(--font-geist-mono)", "monospace"],
        helvetica: [
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
