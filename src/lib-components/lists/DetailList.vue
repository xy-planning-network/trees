<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { useAppFlasher } from "@/composables"
import { SortDir, DetailListAPI } from "@/composables/list"
import BaseAPI from "../../api/base"
import DateFilter from "../layout/DateFilter.vue"
import Paginator from "../navigation/Paginator.vue"

const props = withDefaults(
  defineProps<{
    /**
     * borderless removes the default border styling applied around list items.
     * This is useful when filters or pagination navigation components show,
     * but less helpful when this component is dialed back in functionality.
     */
    borderless?: boolean

    /**
     * defaultSort overrides the default field to sort items on.
     */
    defaultSort?: string

    /**
     * defaultSortDir overrides the default order to sort items with.
     */
    defaultSortDir?: SortDir

    /**
     * disableDate turns off the date-range filter input.
     */
    disableDate?: boolean

    /**
     * disableNavigation hides navigation components from displaying.
     * This makes the List as a "single-page" limiting the number of results via perPage.
     */
    disableNavigation?: boolean

    /**
     * perPage overrides the default number of items per page to retrieve.
     */
    perPage?: number

    /**
     * url is the endpoint to retrieve list data from
     */
    url: string
  }>(),
  {
    borderless: false,
    disableNavigation: false,
    disableDate: false,
    defaultSort: "created_at",
    defaultSortDir: "desc",
    perPage: 10,
  }
)

const dateRange = ref<{ minDate: number; maxDate: number }>({
  minDate: 0,
  maxDate: 0,
})

const items = ref<any[]>([])

const pagination = ref({
  page: 1,
  perPage: props.perPage,
  totalItems: 0,
  totalPages: 0,
})

const sort = ref(props.defaultSort)
const sortDir = ref(props.defaultSortDir)

const loadAndRender = (): void => {
  const params: Record<string, unknown> = {
    maxDate: dateRange.value.maxDate,
    minDate: dateRange.value.minDate,
    page: pagination.value.page,
    perPage: pagination.value.perPage,
    q: "",
    sort: sort.value,
    sortDir: sortDir.value,
  }

  BaseAPI.get(props.url, {}, params).then(
    (success: any) => {
      pagination.value = {
        page: success.data.page,
        perPage: success.data.perPage,
        totalItems: success.data.totalItems,
        totalPages: success.data.totalPages,
      }
      items.value = success.data.items
    },
    () => {
      useAppFlasher.genericError()
    }
  )
}

const hasContent = computed((): boolean => {
  return items.value.length ? true : false
})

const filtersAreConfigured = computed(() => {
  return !props.disableDate
})

const showPaginator = computed(() => {
  return !props.disableNavigation && hasContent
})

const reloadTable = (): void => {
  pagination.value.page = 1
  loadAndRender()
}

const publicMethods: DetailListAPI = {
  refresh: loadAndRender,
  reset: reloadTable,
}

watch([sortDir, dateRange], () => {
  loadAndRender()
})

defineExpose(publicMethods)
loadAndRender()
</script>
<template>
  <div :class="{ 'mt-4 space-y-2': filtersAreConfigured }">
    <div v-if="!disableDate" class="flex">
      <DateFilter
        :date-range="dateRange"
        :sort-dir="sortDir"
        @sort-dir-changed="sortDir = $event"
        @date-range-changed="dateRange = $event"
      />
    </div>

    <div
      v-if="hasContent"
      class="overflow-hidden"
      :class="{ 'shadow sm:rounded-md border': !borderless }"
    >
      <ul>
        <li
          v-for="(item, idx) in items"
          :key="idx"
          :class="{ 'border-t border-gray-200': idx > 0 }"
        >
          <slot :item="item"></slot>
        </li>
      </ul>
    </div>

    <slot v-else name="empty"> No items were found! </slot>

    <Paginator
      v-if="showPaginator"
      v-model="pagination"
      @update:model-value="loadAndRender()"
    />
  </div>
</template>
