/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        graveyard: {
          950: '#07090b',
          900: '#0b0f12',
          850: '#0e1318',
          800: '#141b22',
          750: '#182029',
          700: '#1e2834',
          600: '#2b394a',
          500: '#475569',
        },
        accent: {
          emerald: '#10B981',
          green: '#059669',
          light: '#34D399',
          dark: '#047857'
        },
        status: {
          repair: '#10B981',
          reuse: '#F59E0B',
          recovery: '#F97316',
          recycle: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-orange': '0 0 25px -5px rgba(249, 115, 22, 0.25)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.25)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.6)',
      }
    },
  },
  plugins: [],
};
