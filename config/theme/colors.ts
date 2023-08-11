import colors from "tailwindcss/colors"

export const brandColors = {
  blue: {
    50: "#C9E4F6",
    100: "#B3D9F3",
    200: "#81C2F7",
    300: "#52A8FA",
    400: "#268CFA",
    500: "#1F6DF4",
    600: "#2850BE", // xy-blue Brand:Blueberry
    700: "#20399B",
    800: "#161E74",
    900: "#0C044E", // xy-indigo Brand:Indigo Girl
  },
  green: {
    50: "#DEEFB7",
    100: "#CBE698",
    200: "#B7DD79", // xy-green Brand:Pistachio
    300: "#9FCF6C",
    400: "#86C25F",
    500: "#6DB454",
    600: "#51A749",
    700: "#469946",
    800: "#3B8A43",
    900: "#307D41",
  },
  neutral: {
    // holding on usage for potential palette update
    50: "#FAF9F8",
    100: "#E7E6E5",
    200: "#C9C8C7",
    300: "#B0AFAE",
    400: "#979696",
    500: "#7F7E7D",
    600: "#666565",
    700: "#4D4C4C",
    800: "#333333", // xy-black Brand:XYPN Black
    900: "#1C1B1B",
  },
}

export default {
  gray: colors["neutral"], // adopt Tailwind - Neutral as the primary gray palette
  "xy-blue": {
    DEFAULT: brandColors["blue"][600],
    ...brandColors["blue"],
  },
  "xy-indigo": {
    DEFAULT: brandColors["blue"][900],
  },
  "xy-green": {
    DEFAULT: brandColors["green"][200],
    ...brandColors["green"],
  },
  "xy-black": {
    DEFAULT: brandColors["neutral"][800],
  },
}
