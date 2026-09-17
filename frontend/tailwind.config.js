/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: '#172121',
          inkSoft: '#273333',
          paper: '#fffdf8',
          parchment: '#f4efe6',
          coral: '#e56b5d',
          coralDark: '#bd4e46',
          saffron: '#e9b44c',
          sage: '#5b8e7d',
          line: '#ded6c9',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        sans: ['Trebuchet MS', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
