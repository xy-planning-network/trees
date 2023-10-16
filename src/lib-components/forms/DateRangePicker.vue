<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.min.css"
import { onMounted, ref } from "vue"
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

const targetInput = ref<HTMLInputElement | null>(null)
const {
  aria,
  errorState,
  modelState,
  inputID,
  isRequired,
  onInvalid,
  validate,
} = useInputField({ props, targetInput })

const updateModelValue = (value: { minDate: number; maxDate: number }) => {
  modelState.value = value
}

onMounted(() => {
  const opts: flatpickr.Options.Options = {
    allowInput: true,
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
  <div>
    <InputLabel
      :id="aria.labelledby"
      class="mb-2"
      :for="inputID"
      :label="label"
      :required="isRequired"
    />
    <input
      :id="inputID"
      ref="targetInput"
      :aria-labelledby="aria.labelledby"
      :aria-describedby="aria.describedby"
      :aria-errormessage="aria.errormessage"
      :class="[
        'block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-700 disabled:ring-gray-200',
        errorState
          ? 'text-red-900 ring-red-700 placeholder:text-red-300 focus:ring-red-700'
          : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-xy-blue-500',
      ]"
      :placeholder="placeholder"
      v-bind="$attrs"
      type="text"
      @input="validate"
      @invalid="onInvalid"
    />
    <InputHelp :id="aria.describedby" class="mt-1" :text="help" />
    <InputError :id="aria.errormessage" class="mt-0.5" :text="errorState" />
  </div>
</template>
