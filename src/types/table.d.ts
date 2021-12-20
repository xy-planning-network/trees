import { App, DefineComponent } from "vue"
import UserTypes from "./users"

// TODO: using App instance is a breaking change!  -- doesn't seem like we really need to pass the Vue instance here anyway.
declare namespace Table {
  export interface Column {
    display: string
    class?: string
    key?: string
    presenter?(row: any, instance: App | null): any
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
