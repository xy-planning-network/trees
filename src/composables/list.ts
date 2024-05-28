export interface DetailListAPI {
  /**
   * Force refresh the list data with the current api params state
   * @returns void
   */
  refresh: () => void
  /**
   * Reset the list data back to page 1 and load
   * @returns void
   */
  reset: () => void
}

export type SortDir = "asc" | "desc"
