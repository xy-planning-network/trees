<template>
  <BaseInput
    type="text"
    placeholder="mm-dd-yyyy range"
    :id="uuid"
    :label="label"
    :help="help"
  ></BaseInput>
</template>

<script lang="ts">
import Uniques from "@/helpers/Uniques";
import { Emit, Options, Prop, Vue } from "vue-property-decorator";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import BaseInput from "./BaseInput.vue";

@Options({
  name: "DateRangePicker",
  components: { BaseInput },
})
export default class DateRangePicker extends Vue {
  @Prop({ type: Object, required: true }) modelValue!: {
    minDate: number;
    maxDate: number;
  };
  @Prop({ type: Number, required: false }) startDate?: number;
  @Prop({ type: String, required: false }) label?: string;
  @Prop({ type: String, required: false }) help?: string;

  uuid = (this.$attrs.id as string) || Uniques.CreateIdAttribute();

  @Emit("update:modelValue")
  updateModelValue(value: {
    minDate: number;
    maxDate: number;
  }): { minDate: number; maxDate: number } {
    return value;
  }

  mounted() {
    flatpickr(`#${this.uuid}`, {
      dateFormat: "m-d-Y",
      mode: "range",
      maxDate: new Date(), // So far, we cannot have options past today for ranges
      minDate: this.startDate,
      onClose: (selectedDates) => {
        if (selectedDates.length === 2) {
          this.updateModelValue({
            minDate: selectedDates[0].setUTCHours(0, 0, 0, 0) / 1000,
            maxDate: Math.floor(
              selectedDates[1].setUTCHours(23, 59, 59, 999) / 1000
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
