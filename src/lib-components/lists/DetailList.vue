<script setup lang="ts">
import { useAppFlasher } from "@/composables"
import { ref, watch } from "vue"
import BaseAPI from "../../api/base"
import DateFilter from "../layout/DateFilter.vue"
import Paginator from "../navigation/Paginator.vue"

const props = withDefaults(
  defineProps<{
    refreshTrigger?: number
    reloadTrigger?: number
    title: string
    url: string
  }>(),
  {
    refreshTrigger: 0,
    reloadTrigger: 0,
  }
)

const dateRange = ref<{ minDate: number; maxDate: number }>({
  minDate: 0,
  maxDate: 0,
})
const hasContent = ref(true)
const items = ref<any[]>([])
const pagination = ref({
  page: 1,
  perPage: 10,
  totalItems: 0,
  totalPages: 0,
})
const sortDir = ref("DESC")

const loadAndRender = (checkForContent: boolean): void => {
  const params = {
    page: pagination.value.page,
    perPage: pagination.value.perPage,
    sortDir: sortDir.value,
  }

  BaseAPI.get(props.url, {}, Object.assign(params, dateRange.value)).then(
    (success: any) => {
      pagination.value = {
        page: success.data.page,
        perPage: success.data.perPage,
        totalItems: success.data.totalItems,
        totalPages: success.data.totalPages,
      }
      items.value = success.data.items
      if (checkForContent) hasContent.value = items.value.length != 0
    },
    () => {
      useAppFlasher().genericError()
    }
  )
}

watch([sortDir, dateRange], () => {
  loadAndRender(false)
})

watch(
  () => props.refreshTrigger,
  () => {
    loadAndRender(false)
  }
)

watch(
  () => props.reloadTrigger,
  () => {
    // This lets parent components trigger a refresh of the current page depending on external actions.
    pagination.value.page = 1
    loadAndRender(true)
  }
)

loadAndRender(true)
</script>
<template>
  <div>
    <DateFilter
      :date-range="dateRange"
      :sort-dir="sortDir"
      :title="title"
      @sort-dir-changed="sortDir = $event"
      @date-range-changed="dateRange = $event"
    />

    <div class="shadow overflow-hidden sm:rounded-md border" v-if="hasContent">
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

    <slot name="empty" v-else></slot>

    <Paginator
      v-model="pagination"
      @update:modelValue="loadAndRender(false)"
      v-if="hasContent"
    />
  </div>
</template>
