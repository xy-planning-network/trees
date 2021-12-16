import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"

// TODO: support and preserve import.meta.env in lib build if possible

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
  define: {
    // TODO: conditionally apply during lib build but not dev/serve
    "process.env.VUE_APP_BASE_API_URL": "process.env.VUE_APP_BASE_API_URL",
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
})
