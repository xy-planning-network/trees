<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import { useInputField } from "@/composables/forms"

defineOptions({
  inheritAttrs: false,
})

type TextLikeInputs =
  | "date"
  | "datetime-local"
  | "email"
  | "month"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week"

withDefaults(
  defineProps<{
    type: TextLikeInputs
    help?: string
    label?: string
    modelValue?: string | number
  }>(),
  {
    help: "",
    label: "",
    modelValue: "",
  }
)

const emit = defineEmits(["update:modelValue"])
const { inputID, isValid } = useInputField()
</script>

<template>
  <div>
    <InputLabel
      :id="`${inputID}-label`"
      class="mb-2"
      :for="inputID"
      :label="label"
    />
    <input
      :id="inputID"
      :aria-labelledby="label ? `${inputID}-label` : undefined"
      :aria-describedby="help ? `${inputID}-help` : undefined"
      :class="[
        'block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-700 disabled:ring-gray-200',
        isValid
          ? 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-xy-blue-500'
          : 'text-red-900 ring-red-700 placeholder:text-red-300 focus:ring-red-700',
      ]"
      :type="type"
      :value="modelValue"
      v-bind="$attrs"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <InputHelp :id="`${inputID}-help`" class="mt-1" :text="help" />
  </div>
</template>
