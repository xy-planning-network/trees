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
        @change="sortDirChanged($event.target.value)"
        class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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

<script lang="ts">
import { Emit, Options, Prop, Vue } from "vue-property-decorator";
import DateRangePicker from "../forms/DateRangePicker.vue";

@Options({ components: { DateRangePicker }, name: "DateFilter" })
export default class DateFilter extends Vue {
  @Prop({ type: Object, required: true }) dateRange!: {
    minDate: number;
    maxDate: number;
  };
  @Prop({ type: String, required: true }) sortDir!: string;
  @Prop({ type: String, required: true }) title!: string;

  @Emit()
  sortDirChanged(sortDir: string): string {
    return sortDir;
  }

  @Emit()
  dateRangeChanged(dateRange: {
    minDate: number;
    maxDate: number;
  }): { minDate: number; maxDate: number } {
    return dateRange;
  }
}
</script>
