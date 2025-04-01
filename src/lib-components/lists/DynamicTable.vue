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
  TableBulkActions,
  TableColumns,
  TableRowData,
} from "@/composables/table"
import { useAppFlasher } from "@/composables/useFlashes"
import { TrailsRespPaged } from "@/api/client"
import { DateRange, DateRangeProps } from "@/composables/date"
import { useTable } from "@/composables/useTable"
import TableActionButtons from "./TableActionButtons.vue"

const props = withDefaults(
  defineProps<{
    tableActions?: TableActions<any>
    tableBulkActions?: TableBulkActions<any>
    tableColumns: TableColumns<any>
    tableOptions: DynamicTableOptions
  }>(),
  {
    tableActions: () => ({ type: "dropdown", actions: [] }),
    tableBulkActions: () => ({ actions: [] }),
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
    { skipLoader: false },
    params
  ).then(
    (success) => {
      pagination.value = {
        page: success.data.page,
        perPage: success.data.perPage,
        totalItems: success.data.totalItems,
        totalPages: success.data.totalPages,
      }
      tableData.value = success.data.items as TableRowData[]
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

const setDateRange = (): void => {
  if (dateSearchProps.value.maxRange) {
    const daysAgo = new Date()
    const minDate = daysAgo.setDate(
      daysAgo.getDate() - dateSearchProps.value.maxRange
    )
    const maxDate = new Date()
    dateRange.value = {
      minDate: Math.floor(minDate / 1000),
      maxDate: Math.floor(maxDate.getTime() / 1000),
    }
  }
}

const tableData = ref<TableRowData[]>([])

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

const dateRangeChanged = (newDateRange: DateRange | undefined): void => {
  if (newDateRange) {
    pagination.value.page = 1
    dateRange.value = newDateRange
    loadAndRender()
  }
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

const dateSearchProps = computed((): DateRangeProps => {
  if (typeof props.tableOptions.dateSearch === "object")
    return props.tableOptions.dateSearch
  return {}
})

const hasContent = computed((): boolean => {
  return rows.value.length ? true : false
})

const deselectAll = () => {
  selected.value = []
}

const selected = defineModel<number[]>("selected", {
  required: false,
  default: [],
})

const selectedData = computed<TableRowData[]>(() => {
  return tableData.value.filter((data) => {
    return selected.value.includes(data.id)
  })
})

const bulkActions = computed(() => {
  return props.tableBulkActions.actions
    .filter((action) => {
      return action.show ?? true
    })
    .map((action) => {
      return {
        ...action,
        disabled: selected.value.length === 0 || action.disabled,
        onClick: () =>
          action.onClick.apply(undefined, [
            selected.value,
            selectedData.value,
            publicMethods,
          ]),
      }
    })
})

const hasBulkActions = computed(() => bulkActions.value.length > 0)

const selectableIds = computed(() => {
  return tableData.value
    .filter((row) => {
      if (props.tableBulkActions.isSelectable === undefined) {
        return true
      }

      if (props.tableBulkActions.isSelectable(row)) {
        return true
      }

      return false
    })
    .map((d) => d["id"])
})

const publicMethods: DynamicTableAPI = {
  deselectAll: deselectAll,
  refresh: loadAndRender,
  reset: reloadTable,
}

const { columns, hasActions, isEmptyCellValue, rows } = useTable(
  tableData,
  toRef(props, "tableColumns"),
  toRef(props, "tableActions"),
  publicMethods
)

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
setDateRange()
loadAndRender()
</script>
<template>
  <div>
    <div
      class="flex flex-col mb-4 space-y-4 lg:space-y-0 lg:flex-row lg:justify-between"
    >
      <div v-if="tableOptions.search" class="w-full max-w-lg lg:max-w-xs">
        <label for="table-search" class="sr-only">Search</label>
        <div class="flex items-center gap-x-2">
          <div
            aria-hidden="true"
            class="shrink-0 aspect-square rounded-full bg-gray-50 text-gray-400 h-10 w-10 flex items-center justify-center pointer-events-none"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="flex-1">
            <BaseInput
              id="table-search"
              v-model.trim="query"
              type="search"
              placeholder="Search"
              @change="reloadTable()"
            />
          </div>
        </div>
      </div>
      <div v-if="tableOptions.dateSearch" class="w-full max-w-lg lg:max-w-xs">
        <label for="table-date-range" class="sr-only">Date Range</label>
        <div class="flex items-center gap-x-2">
          <div
            aria-hidden="true"
            class="shrink-0 aspect-square rounded-full bg-gray-50 text-gray-400 h-10 w-10 flex items-center justify-center pointer-events-none"
          >
            <svg
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div class="flex-1">
            <DateRangePicker
              id="table-date-range"
              v-model="dateRange"
              v-bind="{ ...dateSearchProps }"
              @update:model-value="dateRangeChanged"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="relative z-0 min-w-full align-middle border-b border-gray-200 shadow sm:rounded-lg overflow-x-auto"
    >
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th v-if="hasBulkActions" scope="col" class="pl-6 w-4 leading-none">
              <input
                :class="[
                  'h-4 w-4 rounded cursor-pointer',
                  'disabled:bg-gray-100 disabled:border-gray-200  disabled:cursor-not-allowed disabled:opacity-100',
                  'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
                  'border-gray-300 focus:ring-xy-blue-500',
                ]"
                :checked="selected.length === selectableIds.length"
                :indeterminate="
                  selected.length > 0 && selected.length < selectableIds.length
                "
                type="checkbox"
                @change="
                  selected = ($event.target as HTMLInputElement).checked
                    ? selectableIds.map((id) => id)
                    : []
                "
              />
            </th>

            <th
              v-for="(col, idx) in columns"
              :key="idx"
              class="px-6 py-3 text-xs font-medium tracking-wider text-gray-900 uppercase leading-4"
              :class="col.alignment"
            >
              <div
                class="inline-flex items-center gap-2"
                :class="{ 'cursor-pointer': col.sort }"
                @click.prevent="
                  col.sort ? handleSort(col.sort as string) : undefined
                "
              >
                <span v-if="col.title">{{ col.title }}</span>
                <span v-if="col.sort">
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
              </div>
            </th>

            <!--Table Actions Header-->
            <th
              v-if="hasActions"
              class="px-6 py-3 text-xs font-medium tracking-wider text-gray-900 uppercase leading-4"
            />
          </tr>

          <tr v-if="selected.length > 0">
            <td colspan="100%" class="px-6 py-3 border-t bg-neutral-50">
              <div class="flex items-center space-x-3">
                <div class="text-sm font-semibold">
                  {{ selected.length }}
                  selected
                </div>

                <TableActionButtons :actions="bulkActions" />
              </div>
            </td>
          </tr>
        </thead>

        <tbody class="bg-white">
          <tr
            v-for="(row, rowIdx) in rows"
            :key="rowIdx"
            class="even:bg-gray-50"
            @click="$emit('click:row', row.rowData)"
          >
            <td v-if="hasBulkActions" class="pl-6 w-4 leading-none">
              <input
                v-model="selected"
                :class="[
                  'h-4 w-4 rounded cursor-pointer',
                  'disabled:bg-gray-100 disabled:border-gray-200  disabled:cursor-not-allowed disabled:opacity-100',
                  'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
                  'border-gray-300 focus:ring-xy-blue-500',
                ]"
                :disabled="!selectableIds.includes(row.rowData.id)"
                type="checkbox"
                :value="row.rowData.id"
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
              :colspan="columns.length + (hasActions ? 1 : 0)"
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
