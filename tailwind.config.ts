import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          purple: {
            DEFAULT: "#7856E8",
            50: "#F4F1FD",
            100: "#EAE4FB",
            200: "#D6C9F8",
            300: "#B8A3F3",
            400: "#987AEE",
            500: "#7856E8",
            600: "#5E36D9",
            700: "#4926B6",
            800: "#361D88",
            900: "#221356",
          },
          coral: {
            DEFAULT: "#FF7777",
            50: "#FFF2F2",
            100: "#FFE4E4",
            200: "#FFC9C9",
            300: "#FF9E9E",
            400: "#FF7777",
            500: "#F65252",
            600: "#DE3232",
            700: "#B82121",
          },
          yellow: {
            DEFAULT: "#FFD66B",
            50: "#FFFCF0",
            100: "#FFF7D6",
            200: "#FFEEAD",
            300: "#FFD66B",
            400: "#F5BE38",
            500: "#DB9F16",
          },
          mint: {
            DEFAULT: "#4ECCA3",
            50: "#EDFAF5",
            100: "#D3F5E7",
            200: "#A8ECCE",
            300: "#70DEB1",
            400: "#4ECCA3",
            500: "#2BAE84",
          },
          sky: {
            DEFAULT: "#5BC0EB",
            50: "#F0F9FD",
            100: "#DCF2FA",
            200: "#B9E4F5",
            300: "#86CEEE",
            400: "#5BC0EB",
            500: "#2FA4D3",
          },
          bg: {
            light: "#FAF9FF",
            lavender: "#F0EDFF",
            dark: "#121124",
            darkcard: "#1C1B33",
            darksubtle: "#252442",
          },
          text: {
            dark: "#202039",
            muted: "#6B6985",
            light: "#F4F3FB",
          },
        },
      },
      fontFamily: {
        sans: [
          "var(--font-outfit)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(120, 86, 232, 0.08)",
        card: "0 10px 25px -5px rgba(32, 32, 57, 0.06), 0 8px 10px -6px rgba(32, 32, 57, 0.04)",
        "card-hover": "0 20px 35px -5px rgba(120, 86, 232, 0.16), 0 10px 15px -5px rgba(120, 86, 232, 0.1)",
        glow: "0 0 25px rgba(120, 86, 232, 0.35)",
        pop: "0 6px 0 rgba(0, 0, 0, 0.1)",
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-delayed": "float 4s ease-in-out 2s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        bounceGentle: "bounceGentle 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        bounceGentle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
