import { Ref, computed, isVNode, ref } from "vue"
import {
  TableColumns,
  TableRowsData,
  TableActions,
  DynamicTableAPI,
} from "./table"

const isEmptyCellValue = (v: unknown): boolean => {
  return v === null || v === undefined
}

export const useTable = (
  rowData: TableRowsData | Ref<TableRowsData>,
  cols: TableColumns,
  acts: TableActions,
  exposedAPI?: DynamicTableAPI
) => {
  const tableColumn = ref(cols)
  const tableData = ref(rowData)
  const tableActions = ref(acts)

  const hasActions = computed(() => {
    return tableActions.value.length > 0
  })

  const columns = computed(() => {
    return tableColumn.value.map((col) => {
      let alignmentClass = ""
      switch (col?.alignment || "left") {
        case "left":
          alignmentClass = "text-left"
          break
        case "right":
          alignmentClass = "text-right"
          break
        case "center":
          alignmentClass = "text-center"
          break
      }
      return {
        ...col,
        alignment: alignmentClass,
      }
    })
  })

  const rows = computed(() => {
    return tableData.value.map((rowData, rowIdx) => {
      return {
        actions: tableActions.value.map((action) => {
          return {
            ...action,
            event: () => action.event(rowData, rowIdx, exposedAPI),
            enable:
              typeof action.enable === "function"
                ? action.enable(rowData, rowIdx)
                : action.enable,
          }
        }),
        rowData: rowData,
        cells: columns.value.map((col) => {
          const val =
            typeof col.render === "string"
              ? rowData[col.render]
              : col.render(rowData, rowIdx)

          const classNames = col?.classNames || ""

          return {
            ...col,
            isComponent: isVNode(val),
            classNames:
              typeof classNames === "string"
                ? classNames
                : classNames(rowData, rowIdx),
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
