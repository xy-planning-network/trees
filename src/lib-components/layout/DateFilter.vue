<script setup lang="ts">
import { ref } from "vue"
import { DateRange } from "@/composables/date"
import { SortDir } from "@/composables/list"
import DateRangePicker from "../forms/DateRangePicker.vue"
import Select from "@/lib-components/forms/Select.vue"

const props = defineProps<{
  dateRange: DateRange
  sortDir: SortDir
}>()
const dateRange = ref<DateRange>(props.dateRange)
const sortDir = ref<SortDir>(props.sortDir)
const sortOptions: { label: string; value: SortDir }[] = [
  { label: "Newest-Oldest", value: "desc" },
  { label: "Oldest-Newest", value: "asc" },
]

const emits = defineEmits<{
  (e: "sort-dir-changed", val: SortDir): void
  (e: "date-range-changed", val: DateRange): void
}>()

const sortDirChanged = (sortDir: unknown) => {
  if (sortDir === "asc" || sortDir === "desc") {
    emits("sort-dir-changed", sortDir)
  }
}

const dateRangeChanged = (dateRange: DateRange | undefined) => {
  if (dateRange) {
    emits("date-range-changed", dateRange)
  }
}
</script>
<template>
  <div class="flex space-x-3">
    <div>
      <Select
        v-model="sortDir"
        :options="sortOptions"
        @update:model-value="sortDirChanged"
      />
    </div>
    <div class="shrink-0 sm:min-w-[17rem]">
      <DateRangePicker
        v-model="dateRange"
        @update:model-value="dateRangeChanged"
      />
    </div>
  </div>
</template>
