// plugins/logPlugin.ts
import { App } from "vue"

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $log: (...args: any[]) => void
  }
}

export default {
  install(app: App) {
    app.config.globalProperties.$log = (...args: any[]) => {
      args.forEach((msg) => {
        console.log(`[XY log]: ${msg}`)
      })
    }
  },
}
