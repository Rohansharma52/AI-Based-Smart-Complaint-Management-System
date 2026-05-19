/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1',
          600: '#4f46e5', 700: '#4338ca'
        },
        accent: { 400: '#22d3ee', 500: '#06b6d4' },
        dark: { 900: '#0a0a14', 800: '#12121f', 700: '#1a1a2e' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
    }
  },
  // Allow all opacity variants
  safelist: [
    { pattern: /bg-(white|black|indigo|slate|red|green|emerald|amber|blue|cyan|purple|pink|orange|yellow|teal|violet|fuchsia|rose|sky|lime|gray|zinc|neutral|stone)\/\d+/ },
    { pattern: /border-(white|black|indigo|slate|red|green|emerald|amber|blue|cyan|purple|pink|orange|yellow|teal|violet|fuchsia|rose|sky|lime|gray|zinc|neutral|stone)\/\d+/ },
    { pattern: /text-(white|black|indigo|slate|red|green|emerald|amber|blue|cyan|purple|pink|orange|yellow|teal|violet|fuchsia|rose|sky|lime|gray|zinc|neutral|stone)\/\d+/ },
    { pattern: /hover:bg-(white|black|indigo|slate|red|green|emerald|amber|blue|cyan|purple|pink|orange|yellow|teal|violet|fuchsia|rose|sky|lime|gray|zinc|neutral|stone)\/\d+/ },
    { pattern: /hover:border-(white|black|indigo|slate|red|green|emerald|amber|blue|cyan|purple|pink|orange|yellow|teal|violet|fuchsia|rose|sky|lime|gray|zinc|neutral|stone)\/\d+/ },
  ],
  plugins: []
}
