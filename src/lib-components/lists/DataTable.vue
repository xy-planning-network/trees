<script setup lang="ts">
import { useTable } from "@/composables/useTable"
import { useBulkActions } from "@/composables/useBulkActions"
import type {
  TableActions,
  TableBulkActions,
  TableColumns,
  TableRowsData,
} from "@/composables/table"
import { ActionsButtonGroup, ActionsDropdown } from "@/lib-components"
import { toRef } from "vue"

const props = withDefaults(
  defineProps<{
    tableActions?: TableActions<any>
    tableBulkActions?: TableBulkActions<any>
    tableColumns: TableColumns<any>
    tableData: TableRowsData
  }>(),
  {
    tableActions: () => ({ type: "dropdown", actions: [] }),
    tableBulkActions: () => ({ actions: [] }),
  }
)

const selected = defineModel<number[]>("selected", {
  required: false,
  default: [],
})

const {
  bulkActions,
  bulkSelectChecked,
  bulkSelectIndeterminate,
  bulkSelectOnChange,
  hasBulkActions,
  publicMethods,
  selectable,
  selectedOnPage,
} = useBulkActions(
  toRef(props, "tableData"),
  toRef(props, "tableBulkActions"),
  selected
)

const { columns, hasActions, isEmptyCellValue, rows } = useTable(
  toRef(props, "tableData"),
  toRef(props, "tableColumns"),
  toRef(props, "tableActions"),
  publicMethods
)

defineExpose(publicMethods)
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
                  v-if="hasBulkActions"
                  scope="col"
                  class="pl-6 w-4 leading-none"
                >
                  <input
                    :class="[
                      'h-4 w-4 rounded cursor-pointer',
                      'disabled:bg-gray-100 disabled:border-gray-200 disabled:cursor-not-allowed disabled:opacity-100',
                      'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
                      'border-gray-300 focus:ring-xy-blue-500',
                    ]"
                    :checked="bulkSelectChecked"
                    :indeterminate="bulkSelectIndeterminate"
                    type="checkbox"
                    @change="bulkSelectOnChange"
                  />
                </th>

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

              <tr v-if="hasBulkActions && selected.length > 0">
                <td colspan="100%" class="px-6 py-2.5 border-t bg-neutral-50">
                  <div class="flex items-center gap-x-3">
                    <div class="text-sm shrink-0">
                      Selected
                      <span class="font-medium">{{
                        selectedOnPage.length
                      }}</span>
                      of
                      <span class="font-medium">{{ selectable.length }}</span>
                    </div>

                    <ActionsButtonGroup :actions="bulkActions" />
                  </div>
                </td>
              </tr>
            </thead>
            <tbody class="bg-white">
              <tr
                v-for="(row, rowIdx) in rows"
                :key="rowIdx"
                class="even:bg-gray-50"
              >
                <td v-if="hasBulkActions" class="pl-6 w-4 leading-none">
                  <input
                    v-model="selected"
                    :class="[
                      'h-4 w-4 rounded cursor-pointer',
                      'disabled:bg-gray-100 disabled:border-gray-200 disabled:cursor-not-allowed disabled:opacity-100',
                      'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
                      'border-gray-300 focus:ring-xy-blue-500',
                    ]"
                    :disabled="!selectable.includes(row.rowData?.id)"
                    type="checkbox"
                    :value="row.rowData?.id"
                  />
                </td>

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
                  class="px-6 py-2 text-sm text-gray-700 whitespace-nowrap leading-5 w-0"
                >
                  <ActionsDropdown
                    v-if="tableActions.type === 'dropdown'"
                    :actions="row.actions"
                  />

                  <ActionsButtonGroup v-else :actions="row.actions" />
                </td>
              </tr>

              <tr v-if="rows.length === 0">
                <td
                  :colspan="
                    columns.length +
                    (hasActions ? 1 : 0) +
                    (hasBulkActions ? 1 : 0)
                  "
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
