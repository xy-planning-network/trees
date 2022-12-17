import { App, Plugin } from "vue"
import BaseAPI from "@/api/base"
import type {
  HttpPromise,
  HttpError,
  RequestOptions,
  TrailsResponse,
  TrailsResponsePaged,
} from "@/api/client"

// Import vue components
import * as components from "@/lib-components/index"

// install function executed by Vue.use()
const install: Exclude<Plugin["install"], undefined> = function installTrees(
  app: App
) {
  Object.entries(components).forEach(([componentName, component]) => {
    app.component(componentName, component)
  })
}

// Create module definition for Vue.use()
export default install

// expose composables
export * from "@/composables/index"

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from "@/lib-components/index"

export { BaseAPI }
export type {
  HttpPromise,
  HttpError,
  RequestOptions,
  TrailsResponse,
  TrailsResponsePaged,
}
