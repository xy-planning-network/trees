import { resolve } from "path"
import { defineConfig } from "vite"
import components from "unplugin-vue-components/vite"
import markdown from "unplugin-vue-markdown/vite"
import prism from "markdown-it-prism"
import vue from "@vitejs/plugin-vue"

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    base: "/trees/",
    build: {
      outDir: resolve(__dirname, "trees"),
    },
    plugins: [
      vue({
        include: [/\.vue$/, /\.md$/],
      }),
      markdown({
        markdownItUses: [prism],
        wrapperClasses: "prose prose-base max-w-full",
      }),
      components({
        dirs: ["dev/docs/"],
        dts: true,
        extensions: ["md"],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      }),
    ],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
  }
})
