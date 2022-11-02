const colors = require("tailwindcss/colors")

// these colors are deprecated
// let's avoid using them
delete colors["lightBlue"]
delete colors["warmGray"]
delete colors["trueGray"]
delete colors["coolGray"]
delete colors["blueGray"]

module.exports = {
  ...colors,
  "xy-blue": {
    DEFAULT: "#1F6DF4",
  },
  "xy-green": {
    DEFAULT: "#51A749",
  },
  "xy-navy": {
    DEFAULT: "#26547C",
  },
  "xy-dawn": {
    DEFAULT: "#D1FAFF",
  },
  "xy-lime": {
    DEFAULT: "#DEEFB7",
  },
}
