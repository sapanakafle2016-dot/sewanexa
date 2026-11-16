/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Mukta', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mukta: ['Mukta', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#331e6a',
          50: '#f6f4fb',
          100: '#ede8f7',
          200: '#ded4f1',
          300: '#c5b4e7',
          400: '#a38ada',
          500: '#7856c2',
          600: '#5c38ab',
          700: '#48298a',
          800: '#3b2075',
          900: '#331e6a',
          950: '#1c0d40',
        },
        gold: {
          DEFAULT: '#f59e0b',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        esewa: '#60bb46',
        khalti: '#5d2e8e',
      },
    },
  },
  plugins: [],
};
