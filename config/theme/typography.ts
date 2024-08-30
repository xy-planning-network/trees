import defaultTheme from "tailwindcss/defaultTheme"

export const fontFamily = {
  display: ["Work Sans", ...defaultTheme.fontFamily.sans],
  sans: [
    // NOTE(spk): https://tailwindcss.com/docs/font-family#providing-default-font-settings
    `"Open Sans", ${defaultTheme.fontFamily.sans.join(", ")}`,
    {
      // NOTE(spk): suggested by Google Fonts embed
      fontVariationSettings: '"wdth" 100',
    },
  ],
}

// NOTE(spk): The Work Sans font family technically supports weights 100-900,
// here Open Sans is limited to 300-800.  The current brand guidelines only make use of
// the 300-800 weight range for both type faces.
export const fontWeight = {
  light: "300",
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
}
