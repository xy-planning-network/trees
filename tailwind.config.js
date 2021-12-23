/* eslint-disable */
const baseConfig = require("./config/tailwind.config")
module.exports = {
  ...baseConfig,
  mode: "jit",
  purge: [...baseConfig.purge, "./dev/**/*.vue"],
}
