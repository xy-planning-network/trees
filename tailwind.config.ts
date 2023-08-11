import baseConfig from "./config/tailwind.config"
export default {
  ...baseConfig,
  content: [...baseConfig.content, "./dev/**/*.vue"],
}
