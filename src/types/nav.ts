import { DefineComponent } from "vue"

export interface Item {
  icon?: DefineComponent<unknown, unknown, any>
  name: string
  openInTab?: boolean
  url: string
}
