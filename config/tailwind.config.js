/* eslint-disable */
const path = require("path");
const treesTheme = require("./theme");

module.exports = {
  purge: [
    path.resolve(__dirname, "../dev/**/*.vue"),
    path.resolve(__dirname, "./src/lib-components/**/*.vue"),
  ],
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
    require("@tailwindcss/typography")({
      modifiers: ["sm", "lg", "xl"],
    }),
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      animation: treesTheme.animation,
      colors: treesTheme.colors,
      fontFamily: treesTheme.fontFamily,
      fontSize: treesTheme.fontSize,
      fontWeight: treesTheme.fontWeight,
      spacing: treesTheme.spacing,
      typography: (theme) => {
        // TODO: expand on the typography, especially for headings
        return {
          DEFAULT: {
            css: {
              color: theme("colors.gray.900"),
              a: {
                color: theme("colors.xblue.500"),
                "&:hover": {
                  color: theme("colors.blue.600"),
                },
              },
              "h2, h3, h4": {
                color: theme("colors.gray.900"), // TODO: confirm the heading colors
              },
            },
          },
        };
      },
    },
  },
};
