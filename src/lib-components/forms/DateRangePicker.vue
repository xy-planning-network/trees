<template>
  <input
    type="text"
    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
    placeholder="mm-dd-yyyy range"
  />
</template>

<script lang="ts">
import { Emit, Prop, Vue } from "vue-property-decorator";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

export default class DateRangePicker extends Vue {
  @Prop({ type: Object, required: true }) modelValue!: {
    minDate: number;
    maxDate: number;
  };
  @Prop({ type: Number, required: false }) startDate?: number;

  @Emit("update:modelValue")
  updateModelValue(value: {
    minDate: number;
    maxDate: number;
  }): { minDate: number; maxDate: number } {
    return value;
  }

  mounted() {
    flatpickr(this.$el, {
      dateFormat: "m-d-Y",
      mode: "range",
      maxDate: new Date(), // So far, we cannot have options past today for ranges
      minDate: this.startDate,
      onClose: (selectedDates) => {
        if (selectedDates.length === 2) {
          this.updateModelValue({
            minDate: selectedDates[0].getTime() / 1000,
            maxDate: Math.floor(
              selectedDates[1].setHours(23, 59, 59, 999) / 1000
            ),
          });
        } else if (selectedDates.length === 0) {
          this.updateModelValue({
            minDate: 0,
            maxDate: 0,
          });
        }
      },
    });
  }
}
</script>
