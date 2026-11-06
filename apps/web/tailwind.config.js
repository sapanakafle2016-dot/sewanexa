/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcdbff',
          500: '#1e6fe8',
          600: '#1155cc',
          700: '#0c42a6',
          900: '#072a6b',
        },
        esewa: '#60bb46',
        khalti: '#5d2e8e',
      },
    },
  },
  plugins: [],
};

