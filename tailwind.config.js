/* eslint-disable */
const baseConfig = require("./config/tailwind.config")
module.exports = {
  ...baseConfig,
  content: [...baseConfig.content, "./dev/**/*.vue"],
}
