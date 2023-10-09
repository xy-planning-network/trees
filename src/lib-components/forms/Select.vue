<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import { defaultInputProps, useInputField } from "@/composables/forms"
import type { OptionsInput } from "@/composables/forms"

defineOptions({
  inheritAttrs: false,
})

withDefaults(defineProps<OptionsInput>(), {
  ...defaultInputProps,
  placeholder: "Select an option",
})

const emit = defineEmits(["update:modelValue"])
const { inputID, isRequired } = useInputField()
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
    <select
      :id="inputID"
      :aria-labelledby="label ? `${inputID}-label` : undefined"
      :aria-describedby="help ? `${inputID}-help` : undefined"
      :class="[
        'block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6 pl-3 pr-10',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-700 disabled:ring-gray-200 disabled:opacity-100',
        error
          ? 'text-red-900 ring-red-700 placeholder:text-red-300 focus:ring-red-700'
          : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-xy-blue-500',
      ]"
      :value="modelValue"
      v-bind="{
      ...$attrs,
      onChange: ($event) => {
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      },
    }"
    >
      <option value="" disabled selected v-text="placeholder" />
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
        v-text="option.label"
      />
    </select>
    <InputHelp :id="`${inputID}-help`" class="mt-1" :text="help" />
  </div>
</template>
