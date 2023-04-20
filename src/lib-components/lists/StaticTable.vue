<script setup lang="ts">
import { computed, defineComponent } from "vue"
import type { TableColumn, TableRow } from "@/composables/table"

const props = defineProps<{
  columns: TableColumn<TableRow>[]
  rows: TableRow[]
}>()

const tableColumns = computed(() => {
  return props.columns.map((column) => {
    return {
      ...column,
      alignment: column?.alignment ? column?.alignment : "left",
    }
  })
})

const tableRows = computed(() => {
  return props.rows.map((row) => {
    return row
  })
})
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
                  v-for="(col, idx) in tableColumns"
                  :key="idx"
                  class="px-6 py-3 text-xs font-medium tracking-wider text-gray-900 uppercase bg-gray-50 leading-4"
                  :class="{
                    'text-left': col.alignment === 'left',
                    'text-right': col.alignment === 'right',
                    'text-center': col.alignment === 'center',
                  }"
                >
                  {{ col.header }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(row, rowIdx) in tableRows" :key="rowIdx">
                <td
                  v-for="(col, colIdx) in tableColumns"
                  :key="rowIdx + '-' + colIdx"
                  class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap leading-5"
                  :class="{
                    'text-left': col.alignment === 'left',
                    'text-right': col.alignment === 'right',
                    'text-center': col.alignment === 'center',
                  }"
                >
                  <template v-if="typeof col.display === 'string'">{{
                    row[col.display]
                  }}</template>

                  <template
                    v-else-if="
                      typeof col.display === 'function' &&
                      col.display instanceof defineComponent
                    "
                    >{{ col.display(row) }}</template
                  >

                  <component :is="col.display" :row="row" />
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
