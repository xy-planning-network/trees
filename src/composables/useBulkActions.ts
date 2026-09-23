import { computed, type Ref } from "vue"
import type { DynamicTableAPI, TableBulkActions, TableRowData } from "./table"

interface UseBulkActionsOptions {
  refresh?: () => void
  reset?: () => void
}

const staticTableMethod = (method: "refresh" | "reset") => () => {
  console.warn(
    `${method}() was called on a static table, did you mean to use DynamicTable?`
  )
}

export const useBulkActions = <T extends TableRowData>(
  tableData: Ref<T[]>,
  tableBulkActions: Ref<TableBulkActions<T>>,
  selected: Ref<number[]>,
  options: UseBulkActionsOptions = {}
) => {
  const clearSelections = () => {
    selected.value = []
  }

  const selectedData = computed((): T[] => {
    return tableData.value.filter((data) => selected.value.includes(data.id))
  })

  const selectedOnPage = computed(() => {
    return selected.value.filter((id) => selectable.value.includes(id))
  })

  const selectable = computed(() => {
    return tableData.value
      .filter((row) => {
        // Table data must have an "id" key for bulk actions.
        if (row.id === undefined) {
          return false
        }

        if (tableBulkActions.value.isSelectable === undefined) {
          return true
        }

        return tableBulkActions.value.isSelectable(row)
      })
      .map((data) => data.id)
  })

  const publicMethods: DynamicTableAPI<T> = {
    clearSelection: clearSelections,
    selectedData,
    refresh: options.refresh ?? staticTableMethod("refresh"),
    reset: options.reset ?? staticTableMethod("reset"),
  }

  const bulkActions = computed(() => {
    return tableBulkActions.value.actions
      .filter((action) => action.show ?? true)
      .map((action) => {
        return {
          ...action,
          disabled: selected.value.length === 0 || action.disabled,
          onClick: (e?: Event) =>
            action.onClick(
              selected.value,
              selectedData.value,
              publicMethods,
              e
            ),
        }
      })
  })

  const hasBulkActions = computed(() => bulkActions.value.length > 0)

  const bulkSelectChecked = computed(
    () =>
      selectedOnPage.value.length > 0 &&
      selectedOnPage.value.length === selectable.value.length
  )

  const bulkSelectIndeterminate = computed(
    () =>
      selectedOnPage.value.length > 0 &&
      selectedOnPage.value.length < selectable.value.length
  )

  const bulkSelectOnChange = (e: Event) => {
    const isChecked = (e.target as HTMLInputElement).checked

    if (isChecked) {
      selected.value = selectable.value.map((id) => id)
      return
    }

    clearSelections()
  }

  return {
    bulkActions,
    bulkSelectChecked,
    bulkSelectIndeterminate,
    bulkSelectOnChange,
    clearSelections,
    hasBulkActions,
    publicMethods,
    selectable,
    selectedData,
    selectedOnPage,
  }
}
