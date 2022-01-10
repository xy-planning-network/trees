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
    startDate?: number
    label?: string
    help?: string
  }>(),
  {
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
  flatpickr(`#${uuid}`, {
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
  })
})
</script>
<template>
  <BaseInput
    type="text"
    placeholder="mm-dd-yyyy range"
    :id="uuid"
    :label="label"
    :help="help"
  ></BaseInput>
</template>
