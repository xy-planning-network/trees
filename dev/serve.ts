import { createApp } from "vue";
import Serve from "./Serve.vue";
// To register individual components where they are used (serve.vue) instead of using the
// library as a whole, comment/remove this import and it's corresponding "app.use" call
import Trees from "@/entry.esm";
import ClickToCopy from "./helpers/ClickToCopy.vue";
import ComponentLayout from "./helpers/ComponentLayout.vue";
import PropsTable from "./helpers/PropsTable.vue";
import "../tailwind.css";
import mitt from "mitt";

window.VueBus = mitt();
const app = createApp(Serve);
app.use(Trees);
app.component("ClickToCopy", ClickToCopy);
app.component("ComponentLayout", ComponentLayout);
app.component("PropsTable", PropsTable);

app.mount("#app");
