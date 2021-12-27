import { ComponentPublicInstance, DefineComponent } from "vue"
import User from "./users"

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
  currentUser: User
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
  show?(propsData: any, currentUser: User): boolean
}

export interface Static {
  currentUser: User
  columns: Array<Column>
  items: Record<string, unknown>[]
}
