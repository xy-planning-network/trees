<script setup lang="ts">
import { AxiosResponse } from "axios"
import {
  ComponentPublicInstance,
  computed,
  getCurrentInstance,
  ref,
  watch,
} from "vue"
import DateRangePicker from "../forms/DateRangePicker.vue"
import Paginator from "../navigation/Paginator.vue"
import BaseAPI from "../../api/base"
import * as TableTypes from "@/composables/table"

const props = withDefaults(
  defineProps<{
    clickable?: boolean
    loader?: boolean
    tableData: TableTypes.Dynamic
  }>(),
  {
    clickable: false,
    loader: true,
  }
)

const currentSort = ref(
  props.tableData.defaultSort ? props.tableData.defaultSort : ""
)
const currentSortDirection = ref(
  props.tableData.defaultSortDirection
    ? props.tableData.defaultSortDirection
    : "desc"
)
const dateRange = ref({
  minDate: 0,
  maxDate: 0,
})
const items = ref<any[]>([])
const pagination = ref({
  page: 1,
  perPage: 10,
  totalItems: 0,
  totalPages: 0,
})
const query = ref("")
const cellValue = (
  item: Record<string, any>,
  col: TableTypes.Column
): string => {
  if (col.key) {
    // NOTE(dlk): supports dot notation for nested keys
    return col.key.split(".").reduce((o, i) => o[i], item as any)
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

  BaseAPI.get(props.tableData.url, { skipLoader: !props.loader }, params).then(
    (success: AxiosResponse) => {
      pagination.value = {
        page: success.data.page,
        perPage: success.data.perPage,
        totalItems: success.data.totalItems,
        totalPages: success.data.totalPages,
      }
      items.value = success.data.items
    },
    () => {
      window.VueBus.emit(
        "Flash-show-generic-error",
        "membership@xyplanningnetwork.com"
      )
    }
  )
}

const reloadTable = (): void => {
  pagination.value.page = 1
  loadAndRender()
}

const hasContent = computed((): boolean => {
  return items.value.length ? true : false
})

watch(
  () => props.tableData.refreshTrigger,
  () => {
    // This lets parent components trigger a refresh of the current page depending on external actions.
    loadAndRender()
  }
)

watch(
  () => props.tableData.reloadTrigger,
  () => {
    // This lets parent components trigger a reload of page 1 depending on external actions.
    reloadTable()
  }
)

// onCreated
loadAndRender()
</script>
<template>
  <div>
    <div
      class="flex flex-col mb-4 space-y-4 lg:space-y-0 lg:flex-row lg:justify-between"
    >
      <div class="w-full max-w-lg lg:max-w-xs" v-if="tableData.search">
        <Search v-model="query" @input="loadAndRender" />
      </div>
      <div class="w-full max-w-lg lg:max-w-xs" v-if="tableData.dateSearch">
        <DateRangePicker
          v-model="dateRange"
          @update:modelValue="dateRangeChanged"
        />
      </div>
    </div>

    <div
      class="relative z-0 min-w-full align-middle border-b border-gray-200 shadow sm:rounded-lg overflow-x-auto"
    >
      <table class="min-w-full">
        <thead>
          <tr>
            <th
              class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-900 uppercase border-b border-gray-200 bg-gray-50 leading-4"
              v-for="(col, idx) in tableData.columns"
              :key="idx"
            >
              <span v-if="!!col.display.length">{{ col.display }}</span>
              <span
                class="cursor-pointer"
                @click.prevent="handleSort(col.sort as string)"
                v-if="col.sort"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="h-5 inline"
                  v-if="currentSort !== col.sort"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-5 inline"
                  v-else-if="currentSortDirection == 'desc'"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-5 inline"
                  v-else
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </th>
          </tr>
        </thead>

        <tbody class="bg-white">
          <tr
            v-for="(item, rowIdx) in items"
            :key="item.id ? item.id : rowIdx"
            @click="$emit('handleClick', item)"
            :class="{ 'cursor-pointer': clickable }"
          >
            <td
              class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap border-b border-gray-200 leading-5"
              v-for="(col, colIdx) in tableData.columns"
              :key="rowIdx + '-' + colIdx"
              :class="col.class"
            >
              <component
                :is="col.component"
                v-if="col.component"
                :props-data="item"
                :current-user="tableData.currentUser"
                :attribute="col.key"
                :items="col.items"
              ></component>
              <div v-else v-text="cellValue(item, col)"></div>
            </td>
          </tr>

          <tr v-if="!hasContent">
            <td
              :colspan="tableData.columns.length"
              class="px-6 py-4 text-sm text-gray-700 whitespace-nowrap border-b border-gray-200 leading-5"
            >
              No items were found!
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Paginator
      v-model="pagination"
      @update:modelValue="loadAndRender()"
      v-if="hasContent"
    />
  </div>
</template>
