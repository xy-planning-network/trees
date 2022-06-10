// include the type interfaces for Window and GlobalComponents
/// <reference types="../src/global" />
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
import mitt from "mitt"
import useAppFlasher from "@/composables/useFlashes"

window.VueBus = mitt()
useAppFlasher().setConfig({ email: "support@trees.com" })

const app = createApp(Serve)
app.use(Trees)
app.component("ClickToCopy", ClickToCopy)
app.component("ComponentLayout", ComponentLayout)
app.component("PropsTable", PropsTable)
app.mount("#app")
