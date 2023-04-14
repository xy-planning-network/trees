/* eslint-env node */

module.exports = {
  ignorePatterns: ["dist/**/*", "trees/**/*", "types/**/*"],
  extends: "./config/eslint.js",
  rules: {
    "vue/attributes-order": 0,
    "vue/attribute-hyphenation": 0,
    "vue/v-on-event-hyphenation": 0,
    "vue/no-v-html": 0,
    "vue/no-template-shadow": 0,
    "vue/require-explicit-emits": 0,
  },
}
