import { App, Plugin } from "vue"
import BaseAPI, {
  isHttpCancel,
  isHttpError,
  setBaseAPIDefaults,
} from "@/api/base"
import type {
  HttpPromise,
  HttpError,
  QueryParams,
  ReqOptions,
  ReqPayload,
  TrailsPromise,
  TrailsPromisePaged,
  TrailsResp,
  TrailsRespPaged,
} from "@/api/client"
import {
  emailPattern,
  looseToNumber,
  numericInputTypes,
  phonePattern,
  urlPattern,
  textInputTypes,
  useInputField,
} from "@/composables/forms"
import { debounce as debounceFn, debounceLeading } from "@/helpers/Debounce"
import { throttle as throttleFn } from "@/helpers/Throttle"

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

// Http Client exports
export { BaseAPI, isHttpCancel, isHttpError, setBaseAPIDefaults }
export type {
  HttpPromise,
  HttpError,
  QueryParams,
  ReqOptions,
  ReqPayload,
  TrailsPromise,
  TrailsPromisePaged,
  TrailsResp,
  TrailsRespPaged,
}

// Forms exports
export type * from "@/composables/forms"
export {
  emailPattern,
  looseToNumber,
  phonePattern,
  urlPattern,
  numericInputTypes,
  textInputTypes,
  useInputField,
}

// Utilities exports
export { debounceFn, debounceLeading, throttleFn }
