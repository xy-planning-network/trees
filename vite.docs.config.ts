import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Environment from "vite-plugin-environment"

export default defineConfig({
  base: "/trees/",
  build: {
    outDir: resolve(__dirname, "trees"),
  },
  plugins: [
    vue(),
    Environment({
      VUE_APP_BASE_API_URL: "/",
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
})
