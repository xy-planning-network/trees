import { Component, ComponentPublicInstance, RenderFunction } from "vue"
import User from "@/composables/user"

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

export interface Static {
  currentUser: User
  columns: Array<Column>
  items: Record<string, unknown>[]
}

export type TableRow = Record<string, unknown>

export interface TableColumn<T = TableRow> {
  /**
   * The alignment the table cell should have
   */
  alignment?: "left" | "center" | "right"
  /**
   * The text to display as the column header
   */
  header: string
  /**
   * The property value from your table data to use as the cell data
   */
  display: keyof T | ((row: T) => string | number) | RenderFunction
}

export interface SimpleTable<T = TableRow> {
  /**
   * The columns your table should display
   */
  columns: TableColumn<T>[]
  /**
   * The data that should be used to display the table row
   */
  data: T[]
}
