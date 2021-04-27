/* eslint-disable */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: [],
  variants: {
    opacity: ["disabled"],
    cursor: ["disabled"],
    extend: {
      backgroundColor: ["active"],
    },
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
  theme: {
    extend: {
      animation: {
        "spin-gear": "spin 4s cubic-bezier(.68,-0.55,.47,1.55) infinite",
      },
      colors: {
        "xy-blue": "#1f6df4",
        "xy-green": "#51a749"
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
