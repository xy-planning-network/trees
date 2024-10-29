<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import {
  useInputField,
  defaultInputProps,
  defaultModelOpts,
} from "@/composables/forms"
import type { TextareaInput } from "@/composables/forms"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TextareaInput>(), defaultInputProps)

const modelState = defineModel<TextareaInput["modelValue"]>(defaultModelOpts)

const { aria, inputID, isRequired, errorState, onInvalid, inputValidation } =
  useInputField(props)
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
    <textarea
      :id="inputID"
      v-model="modelState"
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
      @input="inputValidation"
      @invalid="onInvalid"
    />
    <InputHelp :id="aria.describedby" class="mt-1" :text="help" />
    <InputError :id="aria.errormessage" class="mt-0.5" :text="errorState" />
  </div>
</template>
