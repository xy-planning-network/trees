import { resolve } from "node:path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: command === "serve" ? "/trees/" : "/",
    build: {
      lib: {
        entry: resolve(import.meta.dirname, "src/entry.ts"),
        name: "Trees",
        fileName: (format) => `trees.${format}.js`,
      },
      rolldownOptions: {
        external: ["vue", /^@heroicons\/vue/],
        output: {
          exports: "named",
          globals: {
            vue: "Vue",
            "@heroicons/vue/solid": "solid",
            "@heroicons/vue/outline": "outline",
          },
        },
      },
    },
    plugins: [vue()],
    resolve: {
      alias: {
        "@": resolve(import.meta.dirname, "src"),
        // Intercept v1-style imports and route them to the v2 24px files.
        "@heroicons/vue/outline": "@heroicons/vue/24/outline",
        "@heroicons/vue/solid": "@heroicons/vue/24/solid",
      },
    },
  }
})
