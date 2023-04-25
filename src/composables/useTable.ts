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

const tableAPIStub: DynamicTableAPI = {
  refresh() {},
  reset() {},
}

export const useTable = (
  rowData: TableRowsData | Ref<TableRowsData>,
  cols: TableColumns | Ref<TableColumns>,
  acts: TableActions | Ref<TableActions>,
  exposedAPI: DynamicTableAPI = tableAPIStub
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
            disabled:
              typeof action.disabled === "function"
                ? action.disabled.apply(undefined, [rowData, rowIdx])
                : action.disabled,
            event: () => action.event(rowData, rowIdx, exposedAPI),
            show:
              typeof action.show === "function"
                ? action.show.apply(undefined, [rowData, rowIdx])
                : action.show,
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
              typeof classNames === "function"
                ? classNames.apply(undefined, [rowData, rowIdx])
                : classNames,
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
