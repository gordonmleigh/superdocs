const { join, dirname } = require("path");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    join(
      dirname(require.resolve("superdocs/tailwind")),
      "components/*.{js,ts,jsx,tsx,mdx}",
    ),
    join(
      dirname(require.resolve("superdocs/tailwind")),
      "components/**/*.{js,ts,jsx,tsx,mdx}",
    ),
  ],
  theme: {
    extend: {
      maxWidth: {
        lg: "33rem",
        "2xl": "40rem",
        "3xl": "50rem",
        "5xl": "66rem",
      },
      typography: require("./typography.js"),
    },
  },
  plugins: [require("superdocs/tailwind"), require("@tailwindcss/typography")],
};
