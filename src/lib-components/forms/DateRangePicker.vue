<script setup lang="ts">
import Uniques from "@/helpers/Uniques"
import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.min.css"
import { onMounted, useAttrs } from "vue"
import BaseInput from "./BaseInput.vue"

const props = withDefaults(
  defineProps<{
    modelValue: {
      minDate: number
      maxDate: number
    }
    allowedRangeInDays?: number
    startDate?: number
    label?: string
    help?: string
  }>(),
  {
    allowedRangeInDays: 0,
    startDate: 0,
    label: "",
    help: "",
  }
)

const emits = defineEmits(["update:modelValue"])
const attrs = useAttrs()
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()

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

  if (props.allowedRangeInDays) {
    // Set the range to a prefilled value given the allowed range
    const daysAgo = new Date()
    opts.defaultDate = [
      daysAgo.setDate(daysAgo.getDate() - props.allowedRangeInDays),
      new Date(),
    ]

    // Handle onChange to dynamically adjust maxDate to x days ahead of the selected start date
    opts.onChange = (selectedDates, _, self) => {
      if (selectedDates.length === 1) {
        // Clone date so as to not change selectedDates[0] value
        var daysAhead = new Date(selectedDates[0].getTime())
        daysAhead.setDate(daysAhead.getDate() + props.allowedRangeInDays)
        const now = new Date()

        if (daysAhead > now) {
          daysAhead = now
        }

        self.set("maxDate", daysAhead)
      }
    }
  }

  flatpickr(`#${uuid}`, opts)
})
</script>
<template>
  <BaseInput
    :id="uuid"
    type="text"
    placeholder="mm-dd-yyyy range"
    :label="label"
    :help="help"
  ></BaseInput>
</template>
