import { DefineComponent, RenderFunction } from "vue"

export interface Item {
  icon?: DefineComponent<unknown, unknown, any> | RenderFunction
  name: string
  openInTab?: boolean
  url: string
}
