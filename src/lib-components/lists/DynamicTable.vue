<script setup lang="ts">
import { computed, ref, toRef, watch } from "vue"
import { ActionsDropdown } from "@/lib-components"
import DateRangePicker from "../forms/DateRangePicker.vue"
import Paginator from "../navigation/Paginator.vue"
import BaseAPI from "../../api/base"
import type {
  DynamicTableAPI,
  DynamicTableOptions,
  TableActions,
  TableColumns,
} from "@/composables/table"
import { useAppFlasher } from "@/composables/useFlashes"
import { TrailsRespPaged } from "@/api/client"
import { useTable } from "@/composables/useTable"
import TableActionButtons from "./TableActionButtons.vue"

const props = withDefaults(
  defineProps<{
    tableActions?: TableActions<any>
    tableColumns: TableColumns<any>
    tableOptions: DynamicTableOptions
  }>(),
  {
    tableActions: () => ({ type: "dropdown", actions: [] }),
  }
)

defineEmits<{
  (e: "click:row", v: any): void
}>()

const loadAndRender = (): void => {
  const params = {
    minDate: dateRange.value.minDate,
    maxDate: dateRange.value.maxDate,
    page: pagination.value.page,
    perPage: pagination.value.perPage,
    sort: currentSort.value,
    sortDir: currentSortDirection.value,
    q: query.value,
  }

  BaseAPI.get<TrailsRespPaged<unknown>>(
    props.tableOptions.url,
    { skipLoader: true },
    params
  ).then(
    (success) => {
      pagination.value = {
        page: success.data.page,
        perPage: success.data.perPage,
        totalItems: success.data.totalItems,
        totalPages: success.data.totalPages,
      }
      tableData.value = success.data.items as Record<string, any>[]
    },
    () => {
      useAppFlasher.genericError()
    }
  )
}

const reloadTable = (): void => {
  pagination.value.page = 1
  loadAndRender()
}

const tableData = ref<Record<string, any>[]>([])

const publicMethods: DynamicTableAPI = {
  refresh: loadAndRender,
  reset: reloadTable,
}

const { columns, hasActions, isEmptyCellValue, rows } = useTable(
  tableData,
  toRef(props, "tableColumns"),
  toRef(props, "tableActions"),
  publicMethods
)

const currentSort = ref(
  props.tableOptions.defaultSort ? props.tableOptions.defaultSort : ""
)
const currentSortDirection = ref(
  props.tableOptions.defaultSortDirection
    ? props.tableOptions.defaultSortDirection
    : "desc"
)
const dateRange = ref({
  minDate: 0,
  maxDate: 0,
})

const pagination = ref({
  page: 1,
  perPage: 10,
  totalItems: 0,
  totalPages: 0,
})
const query = ref("")

const dateRangeChanged = (newDateRange: {
  minDate: number
  maxDate: number
}): void => {
  pagination.value.page = 1
  dateRange.value = newDateRange
  loadAndRender()
}
const handleSort = (selectedSort: string): void => {
  if (currentSort.value == selectedSort) {
    currentSortDirection.value =
      currentSortDirection.value === "desc" ? "asc" : "desc"
  } else {
    currentSort.value = selectedSort
    currentSortDirection.value = "desc"
  }

  loadAndRender()
}

const hasContent = computed((): boolean => {
  return rows.value.length ? true : false
})

watch(
  () => props.tableOptions.refreshTrigger,
  () => {
    // This lets parent components trigger a refresh of the current page depending on external actions.
    loadAndRender()
  }
)

watch(
  () => props.tableOptions.reloadTrigger,
  () => {
    // This lets parent components trigger a reload of page 1 depending on external actions.
    reloadTable()
  }
)

defineExpose(publicMethods)

// onCreated
loadAndRender()
</script>
<template>
  <div>
    <div
      class="flex flex-col mb-4 space-y-4 lg:space-y-0 lg:flex-row lg:justify-between"
    >
      <div v-if="tableOptions.search" class="w-full max-w-lg lg:max-w-xs">
        <label for="search" class="sr-only">Search</label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            v-model.trim="query"
            class="pl-10"
            type="search"
            placeholder="Search"
            @change="reloadTable()"
          />
        </div>
      </div>
      <div v-if="tableOptions.dateSearch" class="w-full max-w-lg lg:max-w-xs">
        <DateRangePicker
          v-model="dateRange"
          @update:model-value="dateRangeChanged"
        />
      </div>
    </div>

    <div
      class="relative z-0 min-w-full align-middle border-b border-gray-200 shadow sm:rounded-lg overflow-x-auto"
    >
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              v-for="(col, idx) in columns"
              :key="idx"
              class="px-6 py-3 text-xs font-medium tracking-wider text-gray-900 uppercase bg-gray-50 leading-4"
              :class="col.alignment"
            >
              <span v-if="col.title">{{ col.title }}</span>
              <span
                v-if="col.sort"
                class="cursor-pointer"
                @click.prevent="handleSort(col.sort as string)"
              >
                <svg
                  v-if="currentSort !== col.sort"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="h-5 inline"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
                <svg
                  v-else-if="currentSortDirection == 'desc'"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-5 inline"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-5 inline"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </th>

            <!--Table Actions Header-->
            <th
              v-if="hasActions"
              class="px-6 py-3 text-xs font-medium tracking-wider text-gray-900 uppercase bg-gray-50 leading-4"
            />
          </tr>
        </thead>

        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, rowIdx) in rows"
            :key="rowIdx"
            @click="$emit('click:row', row.rowData)"
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

          <tr v-if="!hasContent">
            <td
              :colspan="rows.length"
              class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap leading-5"
            >
              No items were found!
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Paginator
      v-if="hasContent"
      v-model="pagination"
      @update:model-value="loadAndRender()"
    />
  </div>
</template>
