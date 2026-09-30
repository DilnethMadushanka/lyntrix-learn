/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Single brand accent: deep lagoon teal. Every interactive / brand
        // surface uses this scale. Semantic colours (emerald = paid/success,
        // amber = pending/warning, rose = live/error) stay separate.
        accent: {
          50: '#effaf8',
          100: '#d4f1ec',
          200: '#aae2da',
          300: '#76cbc1',
          400: '#46ada4',
          500: '#2b918a',
          600: '#1f7570',
          700: '#1c5e5b',
          800: '#1a4c4a',
          900: '#183f3e',
          950: '#072524',
        },
        // Cool neutral tinted toward the accent hue, used as `slate` so the
        // whole app shares one gray family.
        slate: {
          50: '#f6f8f8',
          100: '#eef2f2',
          200: '#dfe5e6',
          300: '#c5cfd1',
          400: '#94a2a6',
          500: '#667478',
          600: '#4b585c',
          700: '#3a4548',
          800: '#263033',
          900: '#172023',
          950: '#0c1315',
        },
      },
      fontFamily: {
        sans: ['Geist', '"Noto Sans Sinhala"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'laser-scan': 'laserScan 2.5s ease-in-out infinite',
      },
      keyframes: {
        laserScan: {
          '0%': { top: '0%' },
          '50%': { top: '95%' },
          '100%': { top: '0%' },
        },
      },
      boxShadow: {
        // Shadows tinted with the neutral hue instead of pure black.
        'soft': '0 1px 2px rgba(23, 32, 35, 0.04), 0 4px 16px -4px rgba(23, 32, 35, 0.08)',
        'lift': '0 2px 4px rgba(23, 32, 35, 0.04), 0 16px 40px -12px rgba(23, 32, 35, 0.18)',
      },
      zIndex: {
        'nav': '40',
        'overlay': '50',
        'toast': '60',
      },
    },
  },
  plugins: [],
}
