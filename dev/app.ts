import { createApp } from "vue"
import "prismjs"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-markup"
import "prismjs/components/prism-markup-templating"
import Trees, {
  setBaseAPIDefaults,
  useAppFlashes,
  type TreesComponents,
} from "@/entry"
import ClickToCopy from "./components/ClickToCopy.vue"
import ComponentLayout from "./components/ComponentLayout.vue"
import DocsDemo from "./components/DocsDemo.vue"
import PropsTable from "./components/PropsTable.vue"
import LogPlugin from "./log"
import Serve from "./app.vue"
import "./main.css"

// NOTE(spk): This declaration has changed.
// See: https://github.com/vuejs/language-tools/wiki/Global-Component-Types
declare module "vue" {
  interface GlobalComponents extends TreesComponents {
    ClickToCopy: typeof ClickToCopy
    ComponentLayout: typeof ComponentLayout
    DocsDemo: typeof DocsDemo
    PropsTable: typeof PropsTable
  }
}

setBaseAPIDefaults({ baseURL: "/" })
useAppFlashes().configure({ email: "support@trees.com" })

const app = createApp(Serve)
app.use(Trees)
app.use(LogPlugin)
app.component("ClickToCopy", ClickToCopy)
app.component("ComponentLayout", ComponentLayout)
app.component("DocsDemo", DocsDemo)
app.component("PropsTable", PropsTable)
app.mount("#app")
