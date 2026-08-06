import js from "@eslint/js"
import pluginVue from "eslint-plugin-vue"
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript"
import globals from "globals"
import skipFormattingConfig from "@vue/eslint-config-prettier/skip-formatting"

export default defineConfigWithVueTs(
  {
    name: "@xy-planning-network/trees/recommended",
    extends: [
      js.configs.recommended,
      pluginVue.configs["flat/recommended"],
      vueTsConfigs.recommended,
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "no-useless-assignment": "off",
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-object-type": [
        "error",
        {
          allowInterfaces: "with-single-extends",
        },
      ],
    },
  },
  skipFormattingConfig
)
