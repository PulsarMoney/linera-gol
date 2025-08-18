import {heroui} from "@heroui/theme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      colors: {
        linera: {
          primary: '#DE2A02',
          'primary-dark': '#B02102',
          'primary-light': '#FF3D0A',
          'primary-lighter': '#FF6B3D',
          background: '#0F1419',
          'background-light': '#1A1F27',
          'background-lighter': '#252C37',
          text: '#FFFFFF',
          'text-muted': '#9CA3AF',
        }
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      dark: {
        colors: {
          primary: {
            DEFAULT: '#DE2A02',
            foreground: '#FFFFFF',
          },
          background: '#0F1419',
          foreground: '#FFFFFF',
        }
      }
    }
  })],
}

module.exports = config;