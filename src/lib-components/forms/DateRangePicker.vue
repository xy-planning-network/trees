<script setup lang="ts">
import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.min.css"
import { onMounted } from "vue"
import BaseInput from "./BaseInput.vue"
import { defaultInputProps, useInputField } from "@/composables/forms"
import type { DateRangeInput } from "@/composables/forms"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DateRangeInput>(), {
  ...defaultInputProps,
  maxRange: 0,
  modelValue: () => {
    return {
      maxDate: 0,
      minDate: 0,
    }
  },
  placeholder: "mm-dd-yyyy range",
  startDate: 0,
})

const emits = defineEmits(["update:modelValue"])
const { inputID } = useInputField()

const updateModelValue = (value: { minDate: number; maxDate: number }) => {
  emits("update:modelValue", value)
}

onMounted(() => {
  const opts: flatpickr.Options.Options = {
    dateFormat: "m-d-Y",
    mode: "range",
    maxDate: new Date(), // So far, we cannot have options past today for ranges
    minDate: props.startDate,
    onClose: (selectedDates) => {
      if (selectedDates.length === 2) {
        updateModelValue({
          minDate: selectedDates[0].setUTCHours(0, 0, 0, 0) / 1000,
          maxDate: Math.floor(
            selectedDates[1].setUTCHours(23, 59, 59, 999) / 1000
          ),
        })
      } else if (selectedDates.length === 0) {
        updateModelValue({
          minDate: 0,
          maxDate: 0,
        })
      }
    },
  }

  // Handle initial values if set
  if (props.modelValue.minDate != 0 && props.modelValue.maxDate != 0) {
    opts.defaultDate = [
      props.modelValue.minDate * 1000,
      props.modelValue.maxDate * 1000,
    ]
  }

  if (props.maxRange) {
    // Handle onChange to dynamically adjust maxDate to x days ahead of the selected start date
    opts.onChange = (selectedDates, _, self) => {
      if (selectedDates.length === 1) {
        // Clone date so as to not change selectedDates[0] value
        var daysAhead = new Date(selectedDates[0].getTime())
        var daysBefore = new Date(selectedDates[0].getTime())
        daysAhead.setDate(daysAhead.getDate() + props.maxRange)
        daysBefore.setDate(daysBefore.getDate() - props.maxRange)
        const now = new Date()

        if (daysAhead > now) {
          daysAhead = now
        }

        self.set("minDate", daysBefore)
        self.set("maxDate", daysAhead)
      }
    }
  }

  flatpickr(`#${inputID.value}`, opts)
})
</script>

<template>
  <BaseInput
    :id="inputID"
    :error="error"
    :help="help"
    :label="label"
    :placeholder="placeholder"
    type="text"
  />
</template>
