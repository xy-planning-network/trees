import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    base: command === "serve" ? "/trees/" : "/",
    build: {
      lib: {
        entry: resolve(__dirname, "src/entry.ts"),
        name: "Trees",
        fileName: (format) => `trees.${format}.js`,
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["vue", /^@heroicons\/vue/],
        output: {
          exports: "named",
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            vue: "Vue",
          },
        },
      },
    },
    plugins: [vue()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        // Intercept v1-style imports and route them to the v2 24px files.
        "@heroicons/vue/outline": "@heroicons/vue/24/outline",
        "@heroicons/vue/solid": "@heroicons/vue/24/solid",
      },
    },
  }
})
