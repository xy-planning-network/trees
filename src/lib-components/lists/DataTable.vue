<script setup lang="ts">
import { useTable } from "@/composables/useTable"
import { TableActions, TableColumns, TableRowsData } from "@/composables/table"
import { ActionsDropdown } from "@/lib-components"

const props = withDefaults(
  defineProps<{
    tableActions?: TableActions<any>
    tableColumns: TableColumns<any>
    tableData: TableRowsData
  }>(),
  {
    tableActions: () => [],
  }
)

const { columns, hasActions, isEmptyCellValue, rows } = useTable(
  props.tableData,
  props.tableColumns,
  props.tableActions
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
            <thead>
              <tr>
                <th
                  v-for="(col, idx) in columns"
                  :key="idx"
                  class="px-6 py-3 text-xs font-medium tracking-wider text-gray-900 uppercase bg-gray-50 leading-4"
                  :class="{
                    'text-left': col.alignment === 'left',
                    'text-right': col.alignment === 'right',
                    'text-center': col.alignment === 'center',
                  }"
                >
                  {{ col.title }}
                </th>

                <!--Table Actions Header-->
                <th
                  v-if="hasActions"
                  class="px-6 py-3 text-xs font-medium tracking-wider text-gray-900 uppercase bg-gray-50 leading-4"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(row, rowIdx) in rows" :key="rowIdx">
                <template v-for="(cell, cellIdx) in row.cells" :key="cellIdx">
                  <component
                    :is="'td'"
                    class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap leading-5"
                    :class="{
                      'text-left': cell.alignment === 'left',
                      'text-right': cell.alignment === 'right',
                      'text-center': cell.alignment === 'center',
                    }"
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
                  class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap leading-5"
                >
                  <ActionsDropdown :items="row.actions" />
                </td>
              </tr>

              <tr v-if="rows.length === 0">
                <td
                  :colspan="columns.length"
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