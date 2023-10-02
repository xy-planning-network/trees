// include the type interfaces for Window and GlobalComponents
/// <reference types="../src/components" />

import { createApp } from "vue"
import Serve from "./serve.vue"
// To register individual components where they are used (serve.vue) instead of using the
// library as a whole, comment/remove this import and it's corresponding "app.use" call
import Trees from "@/entry"
import ClickToCopy from "./helpers/ClickToCopy.vue"
import ComponentLayout from "./helpers/ComponentLayout.vue"
import PropsTable from "./helpers/PropsTable.vue"
import "./main.css"
import { setBaseAPIDefaults } from "@/api/base"
import { useAppFlashes } from "@/composables/useFlashes"
import Highlight from "@point-hub/vue-highlight"
import "highlight.js/styles/atom-one-dark.css"
import html from "highlight.js/lib/languages/xml"
import typescript from "highlight.js/lib/languages/typescript"

// Register Language
Highlight.registerLanguage("html", html)
Highlight.registerLanguage("typescript", typescript)

setBaseAPIDefaults({ baseURL: "/" })
useAppFlashes().configure({ email: "support@trees.com" })

const app = createApp(Serve)
app.use(Trees)
app.use(Highlight.plugin)
app.component("ClickToCopy", ClickToCopy)
app.component("ComponentLayout", ComponentLayout)
app.component("PropsTable", PropsTable)
app.mount("#app")
