import { VNodeChild } from "vue"
import { ActionItem } from "@/composables/nav"
import { DateRangeProps } from "./date"

export interface DynamicTableOptions {
  dateSearch?: boolean | DateRangeProps
  defaultSort?: string
  defaultSortDirection?: string
  refreshTrigger: number
  reloadTrigger?: number
  search?: boolean
  url: string
}

export interface DynamicTableAPI {
  clearSelection: () => void
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

export interface TableActionItem<T = TableRowData> extends ActionItem {
  /**
   * The disabled property determines the value of the disabled attribute on the button
   * attached to the action.  Allowing the action to stay visible to the user, but keeping the action
   * disabled from use.
   *
   * disabled accepts a boolean value or a function with the table row data as
   * the first argument and the row index as the second.
   */
  disabled?: boolean | ((rowData: T, rowIndex: number) => boolean)
  /**
   * onClick is the callback function triggered by the button rendered in the table actions.
   * @param rowData T
   * @param rowIndex number
   * @param tableAPI DynamicTableAPI
   * @returns void
   */
  onClick: (rowData: T, rowIndex: number, tableAPI: DynamicTableAPI) => void
  /**
   * The show property determines whether the action is visible.
   *
   * show accepts a boolean value or a function with the table row data as
   * the first argument and the row index as the second.
   */
  show?: boolean | ((rowData: T, rowIndex: number) => boolean)
}

export interface TableBulkActionItem<T = TableRowData> extends ActionItem {
  disabled?: boolean
  onClick: (
    selected: number[],
    selectedRows: T[],
    tableAPI: DynamicTableAPI
  ) => void
  show?: boolean
}

export interface TableActions<T = TableRowData> {
  /**
   * an array of TableActionItem definitions
   */
  actions: TableActionItem<T>[]
  /**
   * type determines what component will render the actions
   */
  type: "dropdown" | "buttons"
}

export interface TableBulkActions<T extends TableRowData = TableRowData> {
  /**
   * an array of TableActionItem definitions
   */
  actions: TableBulkActionItem<T>[]
  persistent?: boolean // whether to persist the selections across pagination, searching, sorting, and filtering
  // max?: number // TODO(spk): restrain users from creating server bombing selections?
  isSelectable?: (data: T) => boolean
}

export interface TableColumn<T = TableRowData> {
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
   * A show condition for determining whether the column should be shown in the table.
   * Use this condition for supporting dynamic column visibility.
   */
  show?: boolean
  /**
   * A sorting identifier
   * Only used on DynamicTable
   */
  sort?: string
}

export type TableCellAlignment = "left" | "center" | "right"
export type TableRowData<
  // NOTE(spk): enforced that TableRowData has an "id" key
  T extends {
    [key: string]: any
    id: number
  } = {
    [key: string]: any
    id: number
  },
> = T
export type TableColumns<T = TableRowData> = TableColumn<T>[]

export type TableRowsData = TableRowData[]
