import { Ref, computed, isVNode, ref } from "vue"
import { TableColumns, TableRowsData, TableActions } from "./table"

const isEmptyCellValue = (v: unknown): boolean => {
  return v === null || v === undefined
}

export const useTable = (
  rowData: TableRowsData | Ref<TableRowsData>,
  cols: TableColumns,
  acts: TableActions
) => {
  const tableColumn = ref(cols)
  const tableData = ref(rowData)
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
    return tableData.value.map((rowData, rowIdx) => {
      return {
        actions: tableActions.value.map((action) => {
          return {
            ...action,
            callback: () => action.callback(rowData, rowIdx),
            show:
              typeof action.show === "function"
                ? action.show(rowData, rowIdx)
                : action.show,
          }
        }),
        rowData: rowData,
        cells: columns.value.map((col) => {
          const val = col.render
            ? col.render(rowData, rowIdx)
            : rowData[col.key]

          return {
            ...col,
            isComponent: isVNode(val),
            val: val,
          }
        }),
      }
    })
  })

  return {
    columns,
    hasActions,
    isEmptyCellValue,
    rows,
  }
}
