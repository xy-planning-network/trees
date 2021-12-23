import { ComponentPublicInstance, DefineComponent } from "vue"
import UserTypes from "./users"

declare namespace Table {
  export interface Column {
    display: string
    class?: string
    key?: string
    presenter?(row: any, instance: ComponentPublicInstance): any
    component?: DefineComponent<unknown, unknown, any>
    items?: Array<MenuItem>
    sort?: string
  }

  export interface Dynamic {
    currentUser: UserTypes.User
    columns: Array<Column>
    dateSearch?: boolean
    defaultSort?: string
    defaultSortDirection?: string
    refreshTrigger: number
    reloadTrigger?: number
    search?: boolean
    url: string
  }

  export interface MenuItem {
    label: string
    event: string
    show?(propsData: any, currentUser: UserTypes.User): boolean
  }

  export interface Static {
    currentUser: UserTypes.User
    columns: Array<Column>
    items: Record<string, unknown>[]
  }
}

export default Table
