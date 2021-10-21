/* eslint-disable */
const baseConfig = require("./config/tailwind.config");
module.exports = {
  ...baseConfig,
  purge: [...baseConfig.purge, "./dev/**/*.vue"],
};
