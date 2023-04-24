import { ComputedRef, Ref, VNodeChild } from "vue"
import { ActionMenuItem } from "@/composables/nav"

export interface DynamicTableOptions {
  dateSearch?: boolean
  defaultSort?: string
  defaultSortDirection?: string
  refreshTrigger: number
  reloadTrigger?: number
  search?: boolean
  url: string
}

export interface DynamicTableAPI {
  /**
   * Force refresh the table data with the current api params state
   * @returns void
   */
  refresh: () => void
  /**
   * Reset the table data back to page 1 and load
   * @returns void
   */
  reset: () => void
}

export type TableActionItem<T = TableRowData> = ActionMenuItem & {
  event: (rowData: T, rowIndex: number, tableAPI: DynamicTableAPI) => void
  enable?:
    | ((rowData: T, rowIndex: number) => boolean)
    | Ref<boolean>
    | ComputedRef<boolean>
    | boolean
}

export interface TableColumn<T = TableRowData> {
  /**
   * Table actions to make available as an ActionDropdown
   */
  actions?: TableActions<T>
  /**
   * The alignment the table cell should have
   */
  alignment?: TableCellAlignment
  /**
   * Class names to wrap your column data in
   * This field is ignored when a render method is defined
   */
  classNames?: string | ((rowData: T, rowIndex: number) => string)
  /**
   * The text to display as the column header
   */
  title: string
  /**
   * A render method for formatting the output of your columns data
   * This may include returning a custom component using the vue h method
   */
  render:
    | keyof T
    | ((rowData: T, rowIndex: number) => string | number | boolean | VNodeChild)
  /**
   * A sorting identifier
   * Only used on DynamicTable
   */
  sort?: string
}

export type TableActions<T = TableRowData> = TableActionItem<T>[]
export type TableCellAlignment = "left" | "center" | "right"
export type TableRowData = Record<string, any>
export type TableColumns<T = TableRowData> = TableColumn<T>[]
export type TableRowsData = TableRowData[]
