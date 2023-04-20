<script setup lang="ts">
import { DateRange } from "@/composables/date"
import { ref } from "vue"
import DateRangePicker from "../forms/DateRangePicker.vue"
import Select from "@/lib-components/forms/Select.vue"

const props = defineProps<{
  dateRange: DateRange
  sortDir: string
  title: string
}>()
const dateRange = ref<DateRange>(props.dateRange)
const sortDir = ref<string>(props.sortDir)
const sortOptions = [
  { label: "Newest-Oldest", value: "DESC" },
  { label: "Oldest-Newest", value: "ASC" },
]

const emits = defineEmits<{
  (e: "sort-dir-changed", val: string): void
  (e: "date-range-changed", val: DateRange): void
}>()

const sortDirChanged = (sortDir: string) => {
  emits("sort-dir-changed", sortDir)
}

const dateRangeChanged = (dateRange: DateRange) => {
  emits("date-range-changed", dateRange)
}
</script>
<template>
  <div
    class="md:flex md:items-center md:justify-between bg-white mx-auto py-4 border-t border-gray-100"
  >
    <div class="flex-1 min-w-0">
      <h1 class="text-lg leading-6 font-semibold text-gray-900">
        {{ title }}
      </h1>
    </div>
    <div class="mt-4 flex md:mt-0 md:ml-4">
      <Select
        v-model="sortDir"
        :options="sortOptions"
        @update:model-value="sortDirChanged"
      ></Select>
      <DateRangePicker
        v-model="dateRange"
        class="ml-3"
        @update:model-value="dateRangeChanged"
      />
    </div>
  </div>
</template>
