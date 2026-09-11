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
        charcoal: {
          950: '#070A0F',
          900: '#0B0F17',
          850: '#0E1422',
          800: '#141C30',
          750: '#1A243D',
          700: '#222F4F',
          600: '#334155',
          500: '#64748B',
        },
        graveyard: {
          950: '#070A0F',
          900: '#0B0F17',
          850: '#0E1422',
          800: '#141C30',
          750: '#1A243D',
          700: '#222F4F',
          600: '#334155',
          500: '#64748B',
        },
        accent: {
          emerald: '#10B981',
          teal: '#14B8A6',
          cyan: '#06B6D4',
          violet: '#818CF8',
          amber: '#F59E0B',
          rose: '#F43F5E',
          green: '#059669',
          light: '#34D399',
          dark: '#047857'
        },
        status: {
          repair: '#10B981',
          reuse: '#F59E0B',
          recovery: '#F97316',
          recycle: '#EF4444',
          info: '#06B6D4',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.25)',
        'glow-teal': '0 0 25px -5px rgba(20, 184, 166, 0.25)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.25)',
        'glow-violet': '0 0 25px -5px rgba(129, 140, 248, 0.25)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.25)',
        'glow-orange': '0 0 25px -5px rgba(249, 115, 22, 0.25)',
        'glow-red': '0 0 25px -5px rgba(239, 68, 68, 0.25)',
        'card-dark': '0 8px 30px -4px rgba(0, 0, 0, 0.65)',
        'panel': '0 12px 36px -6px rgba(0, 0, 0, 0.55), 0 4px 12px -2px rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [],
};
