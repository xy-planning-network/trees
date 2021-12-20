<script setup lang="ts">
import { ref } from "vue"
import DateRangePicker from "../forms/DateRangePicker.vue"
interface DateRange {
  minDate: number
  maxDate: number
}

const props = defineProps<{
  dateRange: DateRange
  sortDir: string
  title: string
}>()
const dateRange = ref<DateRange>(props.dateRange)

// TODO: type these emit responses
const emits = defineEmits(["sort-dir-changed", "date-range-changed"])

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
      <select
        @change="sortDirChanged(($event.target as HTMLInputElement).value)"
        class="block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      >
        <option value="DESC">Newest-Oldest</option>
        <option value="ASC">Oldest-Newest</option>
      </select>

      <DateRangePicker
        :modelValue="dateRange"
        @update:modelValue="dateRangeChanged($event)"
        class="ml-3"
      />
    </div>
  </div>
</template>
