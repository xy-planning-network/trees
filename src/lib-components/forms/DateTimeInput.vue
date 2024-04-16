<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import {
  useInputField,
  defaultInputProps,
  toDatetimeLocal,
} from "@/composables/forms"
import type { DateTimeInput } from "@/composables/forms"
import { computed, ref } from "vue"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<DateTimeInput>(), defaultInputProps)

defineEmits(["update:modelValue", "update:error"])
const input = ref<HTMLInputElement | null>(null)
const {
  errorState,
  modelState,
  inputID,
  isRequired,
  onInvalid,
  inputValidation,
} = useInputField(props)

const inputValue = computed(() => toDatetimeLocal(modelState.value))

const onInput = (e: Event) => {
  let val = (e.target as HTMLInputElement).value

  modelState.value = val ? new Date(val).toISOString() : val

  inputValidation(e)
}
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
      type="datetime-local"
      :value="inputValue"
      v-bind="$attrs"
      @input="onInput"
      @invalid="onInvalid"
    />
    <InputHelp :id="`${inputID}-help`" class="mt-1" :text="help" />
    <InputError :id="`${inputID}-error`" class="mt-0.5" :text="errorState" />
  </div>
</template>
