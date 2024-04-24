<script setup lang="ts">
import { useTable } from "@/composables/useTable"
import type {
  TableActions,
  TableColumns,
  TableRowsData,
} from "@/composables/table"
import { ActionsDropdown } from "@/lib-components"
import TableActionButtons from "./TableActionButtons.vue"
import { toRef } from "vue"

const props = withDefaults(
  defineProps<{
    tableActions?: TableActions<any>
    tableColumns: TableColumns<any>
    tableData: TableRowsData
  }>(),
  {
    tableActions: () => ({ type: "dropdown", actions: [] }),
  }
)

const { columns, hasActions, isEmptyCellValue, rows } = useTable(
  toRef(props, "tableData"),
  toRef(props, "tableColumns"),
  toRef(props, "tableActions")
)
</script>
<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div
          class="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th
                  v-for="(col, idx) in columns"
                  :key="idx"
                  class="px-6 py-3 text-xs font-medium tracking-wider text-gray-900 uppercase leading-4"
                  :class="col.alignment"
                >
                  {{ col.title }}
                </th>

                <!--Table Actions Header-->
                <th
                  v-if="hasActions"
                  class="px-6 py-3 text-xs font-medium tracking-wider text-gray-900 uppercase leading-4"
                />
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr
                v-for="(row, rowIdx) in rows"
                :key="rowIdx"
                class="even:bg-gray-50"
              >
                <template v-for="(cell, cellIdx) in row.cells" :key="cellIdx">
                  <component
                    :is="'td'"
                    class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap leading-5"
                    :class="cell.alignment"
                  >
                    <template v-if="cell.isComponent">
                      <component :is="cell.val" />
                    </template>

                    <span v-else :class="cell.classNames">
                      {{ isEmptyCellValue(cell.val) ? "-" : String(cell.val) }}
                    </span>
                  </component>
                </template>

                <!--Table Actions Cell-->
                <td
                  v-if="hasActions"
                  class="px-6 py-2 text-sm text-gray-700 whitespace-nowrap leading-5"
                >
                  <ActionsDropdown
                    v-if="tableActions.type === 'dropdown'"
                    :actions="row.actions"
                  />
                  <template v-else>
                    <TableActionButtons :actions="row.actions" />
                  </template>
                </td>
              </tr>

              <tr v-if="rows.length === 0">
                <td
                  :colspan="columns.length + (hasActions ? 1 : 0)"
                  class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap leading-5"
                >
                  No items were found!
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
