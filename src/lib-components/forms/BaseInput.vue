<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import {
  useInputField,
  defaultInputProps,
  defaultModelOpts,
  emailPattern,
  looseToNumber,
  phonePattern,
  urlPattern,
} from "@/composables/forms"
import type { TextLikeInput } from "@/composables/forms"
import { computed, useTemplateRef } from "vue"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TextLikeInput>(), defaultInputProps)
const modelState = defineModel<TextLikeInput["modelValue"]>({
  ...defaultModelOpts,
  // NOTE(spk): transform with caution.  The emitted value will be locally updated
  // in this component and applied to the input's value attribute.
  //
  // The upside to this side effect for number inputs is that we can enforce allowing
  // only character sets that can be parsed into numbers across browsers (Firefox).
  //
  // Example: calling v.trim() may prevent the use of the space character by the user.
  //
  // https://github.com/vuejs/core/commit/de174e1aa756508c7542605a448e55a373afb1ed#diff-f1e0971afb7e61e75d37d0fc7d7f993c9681dddb7c689cb455d217a246b3d6f0
  set: (v) => {
    if (props.type === "number") {
      return looseToNumber(v)
    }

    return v
  },
})
const inputRef = useTemplateRef("input")
const { errorState, inputID, isRequired, onInvalid, inputValidation } =
  useInputField(props)

// A wrapper component may need to have direct access
// to the underlying HTMLInputElement that BaseInput binds to
// example: GoogleMaps Autocomplete inputs
defineExpose({ input: inputRef })

const typeAttributes = computed(() => {
  switch (props.type) {
    case "number":
      return {
        max: Number.MAX_SAFE_INTEGER,
        min: Number.MIN_SAFE_INTEGER,
      }
    case "email":
      return {
        pattern: emailPattern,
      }
    case "tel":
      return {
        pattern: phonePattern,
      }
    case "url":
      return {
        pattern: urlPattern,
      }
    default:
      return {}
  }
})
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
      v-model.trim="modelState"
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
      :type="type"
      v-bind="{ ...typeAttributes, ...$attrs }"
      @click="inputRef?.showPicker()"
      @input="inputValidation"
      @invalid="onInvalid"
    />
    <InputHelp :id="`${inputID}-help`" class="mt-1" :text="help" />
    <InputError :id="`${inputID}-error`" class="mt-0.5" :text="errorState" />
  </div>
</template>
