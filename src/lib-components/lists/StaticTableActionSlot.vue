<script setup lang="ts">
import { ComponentPublicInstance, getCurrentInstance } from "vue"
import * as TableTypes from "@/composables/table"

defineProps<{
  tableData: Omit<TableTypes.Static, "currentUser">
}>()

const cellValue = (
  item: Record<string, any>,
  col: TableTypes.Column
): string => {
  if (col.key) {
    return item[col.key]
  }

  if (col.presenter) {
    // TODO: discuss this pattern.  Current usage can be replaced with modules.
    // https://v3.vuejs.org/api/composition-api.html#getcurrentinstance
    const internalInstance = getCurrentInstance()
    return col.presenter(
      item,
      internalInstance?.proxy as ComponentPublicInstance
    )
  }

  return ""
}
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
                  v-for="(col, idx) in tableData.columns"
                  :key="idx"
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-900 uppercase bg-gray-50 leading-4"
                >
                  {{ col.display }}
                </th>

                <th
                  v-if="$slots['actions']"
                  class="px-6 py-3 text-xs font-medium tracking-wider text-gray-900 uppercase bg-gray-50 leading-4 text-right"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(item, rowIdx) in tableData.items"
                :key="item.id ? (item.id as string) : rowIdx"
              >
                <td
                  v-for="(col, colIdx) in tableData.columns"
                  :key="rowIdx + '-' + colIdx"
                  class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap leading-5"
                >
                  <component
                    :is="col.component"
                    v-if="col.component"
                    :props-data="item"
                    :attribute="col.key"
                  ></component>
                  <span v-else v-text="cellValue(item, col)"></span>
                </td>

                <td
                  v-if="$slots['actions']"
                  class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap leading-5"
                >
                  <slot name="actions" :row="item" />
                </td>
              </tr>

              <tr v-if="tableData.items.length == 0">
                <td
                  :colspan="tableData.columns.length"
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
