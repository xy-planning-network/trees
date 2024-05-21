import { DateRangeProps } from "./date"

export interface DetailListConfig {
  /**
   * alwaysHideNav disables navigation components from displaying whatsoever.
   * This makes the List as a "single-page" limiting the number of results via perPage.
   */
  alwaysHideNav?: boolean

  /**
   * date turns on the date-range filter input
   */
  dateSearch?: boolean | DateRangeProps

  /**
   * defaultSort overrides the default field to sort items on.
   */
  defaultSort?: string

  /**
   * defaultSortDir overrides the default order to sort items with.
   */
  defaultSortDir?: SortDir

  /**
   * perPage overrides the default number of items per page to retrieve.
   */
  perPage?: number

  /**
   * url is the endpoint to retrieve list data from
   */
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
