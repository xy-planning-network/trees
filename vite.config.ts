import { resolve } from "path"
import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import Environment from "vite-plugin-environment"
import deepmerge from "deepmerge"

// TODO: support and preserve import.meta.env in lib build if possible

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config = {
    /**
     * Build specific configuration
     */
    build: {
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
        "process.env.VUE_APP_BASE_API_URL": "process.env.VUE_APP_BASE_API_URL",
      },
    },
    /**
     * Serve (dev) specific configuration
     */
    serve: {
      base: "/trees/",
      plugins: [
        Environment({
          VUE_APP_BASE_API_URL: "",
        }),
      ],
    },
  }

  return deepmerge(
    {
      plugins: [vue()],
      resolve: {
        alias: {
          "@": resolve(__dirname, "src"),
        },
      },
    },
    config[command]
  )
})
