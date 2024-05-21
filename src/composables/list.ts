import { DateRangeProps } from "./date"

export interface DetailListConfig {
  /**
   * date turns on the date-range filter input
   */
  dateSearch?: boolean | DateRangeProps

  defaultSort?: string
  defaultSortDir?: SortDir

  /**
   * alwaysHideNav disables navigation components from displaying whatsoever.
   * This makes the List as a "single-page" limiting the number of results via perPage.
   */
  alwaysHideNav?: boolean

  perPage?: number

  url: string
}

export interface DetailListAPI {
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

export type SortDir = "asc" | "desc"
