import { createApp } from "vue"
import Serve from "./app.vue"
// To register individual components where they are used (serve.vue) instead of using the
// library as a whole, comment/remove this import and it's corresponding "app.use" call
import Trees from "@/entry"
import ClickToCopy from "./components/ClickToCopy.vue"
import ComponentLayout from "./components/ComponentLayout.vue"
import PropsTable from "./components/PropsTable.vue"
import "./main.css"
import { setBaseAPIDefaults } from "@/api/base"
import { useAppFlashes } from "@/composables/useFlashes"

setBaseAPIDefaults({ baseURL: "/" })
useAppFlashes().configure({ email: "support@trees.com" })

declare module "@vue/runtime-core" {
  interface GlobalComponents {
    ClickToCopy: typeof ClickToCopy
    ComponentLayout: typeof ComponentLayout
    PropsTable: typeof PropsTable
  }
}

const app = createApp(Serve)
app.use(Trees)
app.component("ClickToCopy", ClickToCopy)
app.component("ComponentLayout", ComponentLayout)
app.component("PropsTable", PropsTable)
app.mount("#app")
