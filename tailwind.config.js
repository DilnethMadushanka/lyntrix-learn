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
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        cyber: {
          emerald: '#10b981',
          teal: '#14b8a6',
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          fuchsia: '#d946ef',
          amber: '#f59e0b',
          rose: '#f43f5e',
          dark: '#0a0d14',
          darker: '#06080d',
          card: '#0f1422',
          border: 'rgba(255, 255, 255, 0.08)',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'laser-scan': 'laserScan 2.5s ease-in-out infinite',
        'watermark-bounce': 'watermarkBounce 18s linear infinite alternate',
        'glow-spin': 'glowSpin 10s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        laserScan: {
          '0%': { top: '0%' },
          '50%': { top: '95%' },
          '100%': { top: '0%' },
        },
        watermarkBounce: {
          '0%': { top: '10%', left: '10%' },
          '25%': { top: '75%', left: '20%' },
          '50%': { top: '20%', left: '70%' },
          '75%': { top: '70%', left: '60%' },
          '100%': { top: '40%', left: '30%' },
        },
        glowSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'neon-emerald': '0 0 25px rgba(16, 185, 129, 0.35)',
        'neon-indigo': '0 0 25px rgba(99, 102, 241, 0.35)',
        'neon-violet': '0 0 25px rgba(139, 92, 246, 0.35)',
      }
    },
  },
  plugins: [],
}
