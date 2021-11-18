/* eslint-disable */
const path = require("path");
const colors = require("tailwindcss/colors");
const treesTheme = require("./theme");

module.exports = {
  purge: [path.resolve(__dirname, "../src/lib-components/**/*.vue")],
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
    require("@tailwindcss/line-clamp"),
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
      colors: {
        transparent: "transparent",
        current: "currentColor",
        ...colors,
        ...treesTheme.colors,
      },
      fontFamily: treesTheme.fontFamily,
      typography: (theme) => {
        return {
          DEFAULT: {
            css: {
              color: theme("colors.gray.900"),
              a: {
                color: theme("colors.xy-blue"),
                "&:hover": {
                  color: theme("colors.blue.700"),
                },
              },
              "h2, h3, h4": {
                color: theme("colors.gray.900"),
              },
            },
          },
        };
      },
    },
  },
};
