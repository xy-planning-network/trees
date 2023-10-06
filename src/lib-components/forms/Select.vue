<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import { useInputField } from "@/composables/forms"

defineOptions({
  inheritAttrs: false,
})

withDefaults(
  defineProps<{
    label?: string
    help?: string
    placeholder?: string
    options: { label: string; value: string | number }[]
    modelValue: string | number | undefined
  }>(),
  {
    label: "",
    help: "",
    placeholder: "Select an option",
  }
)

const emit = defineEmits(["update:modelValue"])
const { inputID, isValid } = useInputField()
</script>

<template>
  <div>
    <div class="mb-1">
      <InputLabel :id="`${inputID}-label`" :for="inputID" :label="label" />
    </div>
    <select
      :id="inputID"
      :aria-labelledby="label ? `${inputID}-label` : undefined"
      :aria-describedby="help ? `${inputID}-help` : undefined"
      :class="[
        'block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6 pl-3 pr-10',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-600 disabled:ring-gray-200 disabled:opacity-100',
        isValid
          ? 'text-gray-800 ring-gray-300 placeholder:text-gray-400 focus:ring-xy-blue-500'
          : 'text-red-900 ring-red-700 placeholder:text-red-300 focus:ring-red-700',
      ]"
      :value="modelValue"
      v-bind="{
      ...$attrs,
      onChange: ($event) => {
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      },
    }"
    >
      <option
        v-if="placeholder"
        value=""
        disabled
        selected
        v-text="placeholder"
      />
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        v-text="option.label"
      />
    </select>
    <div class="mt-1">
      <InputHelp :id="`${inputID}-help`" :text="help" />
    </div>
  </div>
</template>
