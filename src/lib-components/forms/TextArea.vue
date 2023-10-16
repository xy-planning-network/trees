<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import { useInputField, defaultInputProps } from "@/composables/forms"
import type { TextareaInput } from "@/composables/forms"
import { ref } from "vue"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TextareaInput>(), defaultInputProps)
defineEmits(["update:modelValue", "update:error"])
const targetInput = ref<HTMLInputElement | null>(null)
const {
  aria,
  inputID,
  isRequired,
  modelState,
  errorState,
  onInvalid,
  inputValidation,
} = useInputField({ props, targetInput })

const onInput = (e: Event) => {
  modelState.value = (e.target as HTMLInputElement).value
  inputValidation(e)
}
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
      :value="modelState || undefined"
      v-bind="$attrs"
      @input="onInput"
      @invalid="onInvalid"
    />
    <InputHelp :id="aria.describedby" class="mb-1" :text="help"></InputHelp>
    <InputError :id="aria.errormessage" class="mt-0.5" :text="errorState" />
  </div>
</template>
