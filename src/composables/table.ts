import {
  Component,
  ComponentPublicInstance,
  ComputedRef,
  Ref,
  ShallowRef,
} from "vue"
import User from "@/composables/user"
import { ActionMenuItem } from "@/composables/nav"

export interface Column {
  display: string
  class?: string
  key?: string
  presenter?(row: any, instance: ComponentPublicInstance): any
  component?: Component
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

export interface TableActionItem<T = TableData> extends ActionMenuItem {
  callback: (data: T) => void
  show?: ((data: T) => boolean) | Ref<boolean> | ComputedRef<boolean> | boolean
}

export interface TableColumn<T = TableData> {
  actions?: TableActions<T>
  /**
   * The alignment the table cell should have
   */
  alignment?: TableCellAlignment
  /**
   * The text to display as the column header
   */
  header: string
  /**
   * The property value from your table data to use as the cell data
   */
  display:
    | keyof T
    | ((data: T) => string | number | boolean | null | undefined)
    | ShallowRef<Component>
}

export type TableActions<T = TableData> = TableActionItem<T>[]
export type TableCellAlignment = "left" | "center" | "right"
export type TableData = Record<string, any>
export type TableColumns<T extends TableData = any> = TableColumn<T>[]
export type TableRowsData = TableData[]
