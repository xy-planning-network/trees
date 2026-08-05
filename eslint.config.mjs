import { defineConfig, globalIgnores } from "eslint/config"
import config from "./config/eslint.mjs"

export default defineConfig([
  globalIgnores(["dist/**", "trees/**", "types/**"]),
  {
    files: ["src/**/*.{js,ts,vue}", "dev/**/*.{js,ts,vue}"],
    extends: config,
  },
])
