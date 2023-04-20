import { Component, computed, isVNode, ref, RenderFunction } from "vue"
import { TableColumns, TableRowsData, TableActions } from "./table"

const isEmpty = (v: unknown): boolean => {
  return v === null || v === undefined
}

const isColumnComponent = (display: unknown): display is Component => {
  if (typeof display === "string") {
    return false
  }

  if (isVNode(display)) {
    return true
  }

  // TODO: renderFunctions like heroicons imports will be true
  if (typeof display === "function") {
    return false
  }

  return true
}

export const useTable = (
  data: TableRowsData,
  cols: TableColumns,
  acts: TableActions
) => {
  const tableColumn = ref(cols)
  const tableData = ref(data)
  const tableActions = ref(acts)

  const hasActions = computed(() => {
    return tableActions.value.length > 0
  })

  const columns = computed(() => {
    return tableColumn.value.map((col) => {
      return {
        ...col,
        alignment: col?.alignment || "left",
      }
    })
  })

  const rows = computed(() => {
    return tableData.value.map((data) => {
      return {
        actions: tableActions.value.map((action) => {
          return {
            ...action,
            callback: () => action.callback(data),
            show:
              typeof action.show === "function"
                ? action.show(data)
                : action.show,
          }
        }),
        data: data,
        cells: columns.value.map((col) => {
          let stringVal = undefined
          if (typeof col.display === "string") {
            stringVal = data[col.display]
          }

          if (typeof col.display === "function") {
            stringVal = (col.display as Function)(data)
          }

          return {
            ...col,
            isComponent: isColumnComponent(col.display) ? true : false,
            stringVal: isEmpty(stringVal) ? "-" : String(stringVal),
          }
        }),
      }
    })
  })

  return {
    columns,
    hasActions,
    rows,
  }
}
