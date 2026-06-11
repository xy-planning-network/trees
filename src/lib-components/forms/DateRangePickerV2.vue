<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue"
import {
  defaultInputProps,
  defaultModelOpts,
  useInputField,
} from "@/composables/forms"
import type { DateRangeInput } from "@/composables/forms"
import RangeCalendar from "@/lib-components/forms/RangeCalendar.vue"
import { CalendarDateRangeIcon, XMarkIcon } from "@heroicons/vue/solid"

import {
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverPortal,
  PopoverRoot,
  PopoverTrigger,
} from "reka-ui"

defineOptions({
  inheritAttrs: false,
})

// TODO (spk):

// - ensure it works on the dynamic table correctly (needs better model change handling)
// - clear triggers two requests
// - add subtle gray to days outside of current month?

// Done:
//
// - propatize the quick setters
// - add clear option
// - add calendar icon
// - open on focus, close on blur
// - support query params on named input?
// - support required and invalid errors and display
// - allow position prop
// - triple check z-index
// - kill startDate in favor of minDate or kill maxDate in favor of endDate
// - format the output of input box in mm-dd-yyyy - mm-dd-yyyy format
// - ensure it works inside a slideover correctly
// - support maxRange
// - support startDate
// - support maxDate

// Backlog:
//
// - support changing the Year/Month directly?
// - add arrow to popover
// - two month display - it's really big

// Breaking Changes:
//
// - rename maxDate prop => maxValue
// - rename startDate prop => minValue
// - maxValue and minValue only accept Date type

// New Features:
//
// - quick sets
// - max-range, min-value, and max-value can all work together

const props = withDefaults(defineProps<DateRangeInput>(), {
  ...defaultInputProps,
  actions: () => [],
  maxRange: undefined,
  maxValue: () => new Date(),
  minValue: undefined,
  placeholder: "mm-dd-yyyy to mm-dd-yyyy",
  position: "bottom-start",
})

const modelState = defineModel<DateRangeInput["modelValue"]>({
  ...defaultModelOpts,
  default: { maxDate: undefined, minDate: undefined },
})

const { aria, inputID, errorState, isRequired, nameAttr, onInvalid } =
  useInputField(props)

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
})

const display = computed(() => {
  let out = ""

  if (modelState.value?.minDate) {
    out += `${dateFormatter.format(
      new Date(modelState.value.minDate * 1000)
    )} to `
  }

  if (modelState.value?.maxDate) {
    out += dateFormatter.format(new Date(modelState.value.maxDate * 1000))
  }

  return out
})

const reset = () => {
  modelState.value = { maxDate: 0, minDate: 0 }
}

const isValid = computed(() => {
  return !!(modelState.value?.maxDate && modelState.value?.minDate)
})

const onUpdate = () => {
  if (isValid.value) {
    errorState.value = ""
  }
}

const isOpen = ref(false)
const onUpdateIsOpen = (open: boolean) => {
  if (!open && !isValid.value) {
    reset()
  }
}

const calendarRef = useTemplateRef<InstanceType<typeof RangeCalendar> | null>(
  "calendar"
)

const inputRef = useTemplateRef<HTMLInputElement | null>("input")

defineExpose({ calendar: calendarRef, input: inputRef })

const alignment = computed(() => {
  switch (props.position) {
    case "bottom-start":
      return "start"
    case "bottom-end":
      return "end"
    default: // bottom
      return "center"
  }
})
</script>

<template>
  <PopoverRoot v-model:open="isOpen" @update:open="onUpdateIsOpen">
    <div class="xy-date-range-picker">
      <InputLabel
        :id="aria.labelledby"
        class="mb-2"
        :for="inputID"
        :label="label"
        :required="isRequired"
      />
      <div class="relative">
        <input
          :id="inputID"
          ref="input"
          :aria-labelledby="aria.labelledby"
          :aria-describedby="aria.describedby"
          :aria-errormessage="aria.errormessage"
          :class="[
            'block w-full rounded-md border-0 py-2 pr-9 shadow-sm ring-1 ring-inset focus:ring-2 data-[state=open]:ring-2 sm:text-sm sm:leading-6',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-700 disabled:ring-gray-200',
            errorState
              ? 'text-red-900 ring-red-700 placeholder:text-red-300 focus:ring-red-700 data-[state=open]:ring-red-700'
              : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-xy-blue-500 data-[state=open]:ring-xy-blue-500',
          ]"
          :data-state="isOpen ? 'open' : 'closed'"
          :placeholder="placeholder"
          readonly
          :value="display"
          v-bind="$attrs"
          type="text"
          @focus="isOpen = true"
        />

        <PopoverAnchor class="absolute left-0 right-0 bottom-0" />

        <div class="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-500">
          <button v-if="isValid" class="p-2" @click="reset">
            <XMarkIcon class="w-5 h-5" />
          </button>

          <PopoverTrigger class="p-2" tabindex="-1">
            <CalendarDateRangeIcon class="w-5 h-5" />
          </PopoverTrigger>
        </div>
      </div>

      <InputHelp :id="aria.describedby" class="mt-1" :text="help" />
      <InputError :id="aria.errormessage" class="mt-0.5" :text="errorState" />

      <input
        class="sr-only top-1 left-1"
        aria-hidden="true"
        :name="`${nameAttr}[minDate]`"
        :required="isRequired"
        :value="modelState?.minDate"
        tabindex="-1"
        @invalid="onInvalid"
      />
      <input
        class="sr-only top-1 left-1"
        aria-hidden="true"
        :name="`${nameAttr}[maxDate]`"
        :required="isRequired"
        :value="modelState?.maxDate"
        tabindex="-1"
        @invalid="onInvalid"
      />
    </div>

    <PopoverPortal>
      <PopoverContent
        :align="alignment"
        side="bottom"
        :align-flip="false"
        :side-flip="false"
        :side-offset="5"
      >
        <RangeCalendar
          ref="calendar"
          v-model="modelState"
          :actions="actions"
          :max-range="maxRange"
          :max-value="maxValue"
          :min-value="minValue"
          @update:model-value="onUpdate"
        />
        <PopoverArrow class="fill-white stroke-gray-200" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
