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
  clearSelection() {
    console.warn(
      "clearSelection() was called on a static table, did you mean to use DynamicTable?"
    )
  },
  refresh() {
    console.warn(
      "refresh() was called on a static table, did you mean to use DynamicTable?"
    )
  },
  reset() {
    console.warn(
      "reset() was called on a static table, did you mean to use DynamicTable?"
    )
  },
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
    return tableActions.value.actions.length > 0
  })

  const columns = computed(() => {
    return tableColumn.value
      .filter((col) => col.show ?? true)
      .map((col) => {
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
        actions: tableActions.value.actions.map((action) => {
          return {
            ...action,
            disabled:
              typeof action.disabled === "function"
                ? action.disabled.apply(undefined, [rowData, rowIdx])
                : action.disabled,
            onClick: () => action.onClick(rowData, rowIdx, exposedAPI),
            show:
              typeof action.show === "function"
                ? action.show.apply(undefined, [rowData, rowIdx])
                : action.show,
          }
        }),
        rowData: rowData,
        cells: columns.value.map((col) => {
          const val =
            typeof col.render === "function"
              ? col.render.apply(undefined, [rowData, rowIdx])
              : rowData[col.render]

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
