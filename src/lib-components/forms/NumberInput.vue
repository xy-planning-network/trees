<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import {
  useInputField,
  defaultInputProps,
  defaultModelOpts,
} from "@/composables/forms"
import type { NumericInput } from "@/composables/forms"
import { computed, useAttrs, useTemplateRef } from "vue"
import { maskito as vMaskito } from "@maskito/vue"
import { maskitoTransform } from "@maskito/core"
import {
  MaskitoNumberParams,
  maskitoNumberOptionsGenerator,
} from "@maskito/kit"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<NumericInput>(), {
  ...defaultInputProps,
  max: Number.MAX_SAFE_INTEGER,
  min: Number.MIN_SAFE_INTEGER,
  precision: 0,
  type: "number",
})

const opts = computed(() => {
  const params: MaskitoNumberParams = {
    decimalSeparator: ".",
    thousandSeparator: ",",
    min: props.min,
    max: props.max,
    precision: props.precision,
    minusSign: "-",
  }

  switch (props.type) {
    case "money":
      params.decimalZeroPadding = true
      params.precision = 2
      params.prefix = "$"
      break

    default:
      break
  }

  return maskitoNumberOptionsGenerator(params)
})

const modelState = defineModel<NumericInput["modelValue"]>(defaultModelOpts)

/**
 * masked is a writable computed variable that ensures the modelState
 * is only set to a valid numeric value as the masked state is a string which
 * may contain prefix and postfix characters as well as leading or trailing "-", and "." characters.
 *
 * It additionally handles the computation of converting a "money" input to an amount in U.S. cents.
 */
const masked = computed({
  get: () => {
    if (modelState.value === null || modelState.value === undefined) {
      return ""
    }

    let num = modelState.value
    if (props.type === "money") {
      num = num / 100
    }

    return maskitoTransform(num.toString(), opts.value)
  },
  set: (v) => {
    if (v === "") {
      modelState.value = null
      return
    }

    let number = parseFloat(v.toString().replace(/[^\d.-]/g, ""))
    if (isNaN(number)) {
      modelState.value = null
      return
    }

    if (props.type === "money") {
      number = number * 100
    }

    modelState.value = number
  },
})

const inputRef = useTemplateRef("input")

const {
  errorState,
  inputID,
  isRequired,
  nameAttr,
  onInvalid,
  inputValidation,
} = useInputField(props)

// NOTE(spk): reserve the name attribute for the hidden number input.
const inputAttrs = computed(() => {
  const attributes = useAttrs()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, ...attrs } = attributes
  return attrs
})

defineExpose({ input: inputRef })
</script>

<template>
  <div>
    <InputLabel
      :id="`${inputID}-label`"
      class="mb-2"
      :for="inputID"
      :label="label"
      :required="isRequired"
    />
    <input
      :id="inputID"
      ref="input"
      v-model="masked"
      v-maskito="opts"
      :aria-labelledby="label ? `${inputID}-label` : undefined"
      :aria-describedby="help ? `${inputID}-help` : undefined"
      :aria-errormessage="errorState ? `${inputID}-error` : undefined"
      :class="[
        'block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-700 disabled:ring-gray-200',
        errorState
          ? 'text-red-900 ring-red-700 placeholder:text-red-300 focus:ring-red-700'
          : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-xy-blue-500',
      ]"
      :placeholder="placeholder"
      type="text"
      inputmode="decimal"
      v-bind="{ ...inputAttrs }"
      @input="inputValidation"
    />

    <InputHelp :id="`${inputID}-help`" class="mt-1" :text="help" />
    <InputError :id="`${inputID}-error`" class="mt-0.5" :text="errorState" />
    <input
      :value="modelState"
      class="sr-only"
      aria-hidden="true"
      :name="nameAttr"
      :min="min"
      :max="max"
      :required="isRequired"
      tabindex="-1"
      type="number"
      @invalid="onInvalid"
    />
  </div>
</template>
