const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        code: {
          keyword: colors.red[500],
          literalType: colors.blue[700],
          operator: colors.zinc[400],
        },
      },

      maxWidth: {
        lg: '33rem',
        '2xl': '40rem',
        '3xl': '50rem',
        '5xl': '66rem',
      },
      typography: require('./typography.js'),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
