<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.min.css"
import { onMounted, useTemplateRef, watch } from "vue"
import {
  defaultInputProps,
  defaultModelOpts,
  useInputField,
} from "@/composables/forms"
import type { DateRangeInput } from "@/composables/forms"
import { Instance } from "flatpickr/dist/types/instance"
import { DateRange } from "@/composables/date"

defineOptions({
  inheritAttrs: false,
})

// maxDate/startDate should be used or maxRange.
// The props combination of maxDate/startDate and maxRange
// will have unexpected results.
const props = withDefaults(defineProps<DateRangeInput>(), {
  ...defaultInputProps,
  maxDate: () => new Date(),
  maxRange: 0,
  placeholder: "mm-dd-yyyy range",
  startDate: 0,
})

const modelState = defineModel<DateRangeInput["modelValue"]>({
  ...defaultModelOpts,
  default: { maxDate: 0, minDate: 0 },
})

function isValidPickerRange(val: any): val is DateRange {
  return (
    val?.maxDate !== undefined &&
    val?.minDate !== undefined &&
    val?.minDate != 0 &&
    val?.maxDate != 0
  )
}

// NOTE(spk): use watcher.stop() and watcher.resume() when mutating
// state inside this component to avoid setting the picker value
// after the state was mutated by the picker itself
//
// This keeps the change handling scoped to a change triggered by
// the parent component on v-model.
const watcher = watch(modelState, () => {
  if (isValidPickerRange(modelState.value)) {
    picker?.setDate(
      [modelState.value.minDate * 1000, modelState.value.maxDate * 1000],
      false
    )
    return
  }

  picker?.clear()
})

const { aria, errorState, inputID, isRequired, onInvalid, validate } =
  useInputField(props)

const updateModelState = (value: { minDate: number; maxDate: number }) => {
  watcher.stop()
  modelState.value = value
  watcher.resume()
}

const wrapperRef = useTemplateRef("wrapper")

let picker: Instance | null = null

onMounted(() => {
  const opts: flatpickr.Options.Options = {
    allowInput: !props.maxRange,
    appendTo: wrapperRef.value || undefined,
    dateFormat: "m-d-Y",
    mode: "range",
    maxDate: props.maxDate,
    minDate: props.startDate,
    onClose: (selectedDates) => {
      if (selectedDates.length === 2) {
        updateModelState({
          minDate: selectedDates[0].setUTCHours(0, 0, 0, 0) / 1000,
          maxDate: Math.floor(
            selectedDates[1].setUTCHours(23, 59, 59, 999) / 1000
          ),
        })
      } else if (selectedDates.length === 0) {
        updateModelState({
          minDate: 0,
          maxDate: 0,
        })
      }
    },
    static: true,
  }

  // Handle initial values if set
  if (isValidPickerRange(modelState.value)) {
    opts.defaultDate = [
      modelState.value.minDate * 1000,
      modelState.value.maxDate * 1000,
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

  picker = flatpickr(`#${inputID.value}`, opts) as Instance
})
</script>

<template>
  <div ref="wrapper" class="xy-date-range-picker">
    <InputLabel
      :id="aria.labelledby"
      class="mb-2"
      :for="inputID"
      :label="label"
      :required="isRequired"
    />
    <input
      :id="inputID"
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
