import {
  FunctionalComponent,
  RenderFunction,
  VNodeChild,
  type ComputedRef,
} from "vue"
import { DateRangeProps } from "./date"

export interface DynamicTableOptions {
  dateSearch?: boolean | DateRangeProps
  defaultSort?: string
  defaultSortDirection?: string
  pageOptions?: { label: string; value: number }[]
  perPage?: number
  refreshTrigger: number
  reloadTrigger?: number
  search?: boolean
  url: string
}

export interface DynamicTableAPI<T = TableRowData> {
  /**
   * Clear the currently selected rows when bulk selections are enabled
   * This method is called when refresh and reset methods are called.
   * @returns void
   */
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
  /**
   * The selected data records when bulk actions are enabled on the table
   */
  selectedData: ComputedRef<T[]>
}

export type TableActionItem<T = TableRowData> =
  | TableActionButton<T>
  | TableActionLink<T>

/**
 * TableActionButton determines the configuration for a action button within a table row.
 * Visibility (`show`) and interactivity (`disabled`) can be toggled via static booleans
 * or dynamic methods based on the specific row's state and index.
 *
 * @template T The shape of the underlying row data.
 */
export interface TableActionButton<T = TableRowData> {
  label: string
  attrs?: never
  disabled?: boolean | ((rowData: T, rowIndex: number) => boolean)
  icon?: FunctionalComponent | RenderFunction
  openInTab?: never
  show?: boolean | ((rowData: T, rowIndex: number) => boolean)
  url?: never
  /**
   * onClick is the callback function triggered by the button rendered in the table actions.
   * @param rowData T
   * @param rowIndex number
   * @param tableAPI DynamicTableAPI
   * @param e Event | undefined
   * @returns void
   */
  onClick: (
    rowData: T,
    rowIndex: number,
    tableAPI: DynamicTableAPI,
    e?: Event
  ) => void
}

/**
 * TableActionLink determines the configuration for a link button within a table row.
 * Visibility (`show`) and interactivity (`disabled`) can be toggled via static booleans
 * or dynamic methods based on the specific row's state and index.
 * HTML Attributes can be defined on (`attrs`) for additional HTML anchor tag attributes
 * that are not explicitly defined in the interface.
 *
 * @template T The shape of the underlying row data.
 */
export interface TableActionLink<T = TableRowData> {
  label: string
  url: string
  attrs?: Record<string, string | number | boolean>
  disabled?: boolean | ((rowData: T, rowIndex: number) => boolean)
  icon?: FunctionalComponent | RenderFunction
  openInTab?: boolean
  show?: boolean | ((rowData: T, rowIndex: number) => boolean)
  /**
   * onClick is the callback function triggered by the button rendered in the table actions.
   * @param rowData T
   * @param rowIndex number
   * @param tableAPI DynamicTableAPI
   * @param e Event | undefined
   * @returns void
   */
  onClick: (
    rowData: T,
    rowIndex: number,
    tableAPI: DynamicTableAPI,
    e?: Event
  ) => void
}

/**
 * TableBulkActionItem determines the configuration for a bulk action button on a table.
 * Visibility (`show`) and interactivity (`disabled`) can be toggled via static booleans.
 *
 * @template T The shape of the underlying row data.
 */
export interface TableBulkActionItem<T = TableRowData> {
  label: string
  disabled?: boolean
  icon?: FunctionalComponent | RenderFunction
  show?: boolean
  /**
   * The callback method triggered by the action item buttons click event.
   * @param selected the array of selected rows by the primary key `id`
   * @param selectedData the array of selected rows as the underlying data type T
   * @param tableAPI DynamicTableAPI
   * @param e Event | undefined
   * @returns void
   */
  onClick: (
    selected: number[],
    selectedData: T[],
    tableAPI: DynamicTableAPI,
    e?: Event
  ) => void
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

export interface TableBulkActions<T = TableRowData> {
  /**
   * an array of TableActionItem definitions
   */
  actions: TableBulkActionItem<T>[]
  /**
   * a function that determines if the row can be selected for bulk actions
   */
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
export type TableRowData = Record<string, any>
export type TableColumns<T = TableRowData> = TableColumn<T>[]

export type TableRowsData = TableRowData[]
