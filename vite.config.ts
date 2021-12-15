import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import EnvironmentPlugin from "vite-plugin-environment"

// TODO: preserve process.env in lib build
// TODO: preserve import.meta.env in lib build

// https://vitejs.dev/config/
export default defineConfig({
  base: "/trees/",
  build: {
    lib: {
      entry: resolve(__dirname, "src/entry.ts"),
      name: "Trees",
      fileName: (format) => `trees.${format}.js`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
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
  plugins: [
    vue(),
    EnvironmentPlugin({
      VUE_APP_BASE_API_URL: "/api/v1",
    }), // TODO: conditionally apply this during serve and docs build
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
})
