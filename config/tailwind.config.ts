import path from "path"
import treesTheme from "./theme"

export default {
  content: [
    path.resolve(__dirname, "../src/lib-components/**/*.vue"),
    path.resolve(__dirname, "../src/composables/**/*.ts"),
  ],
  plugins: [
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
      typography: (theme) => {
        return {
          DEFAULT: {
            css: {
              color: theme("colors.gray.900"),
              a: {
                color: theme("colors.xy-blue.DEFAULT"),
                "&:hover": {
                  color: theme("colors.blue.700"),
                },
              },
              "h2, h3, h4": {
                color: theme("colors.gray.900"),
              },
            },
          },
        }
      },
    },
  },
}
