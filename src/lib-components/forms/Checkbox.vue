<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import { useInputField, defaultInputProps } from "@/composables/forms"
import type { BooleanInput } from "@/composables/forms"

defineOptions({
  inheritAttrs: false,
})

withDefaults(defineProps<BooleanInput>(), defaultInputProps)

const emits = defineEmits(["update:modelValue"])
const { inputID, isDisabled, isRequired } = useInputField()
</script>

<template>
  <div class="relative flex items-start">
    <div class="flex items-center h-5">
      <input
        :id="inputID"
        :aria-labelledby="label ? `${inputID}-label` : undefined"
        :aria-describedby="help ? `${inputID}-help` : undefined"
        :checked="modelValue || undefined"
        :class="[
          'h-4 w-4 rounded text-xy-blue cursor-pointer',
          'disabled:bg-gray-100 disabled:border-gray-200  disabled:cursor-not-allowed disabled:opacity-100',
          'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
          error
            ? 'border-red-700 focus:ring-red-700'
            : 'border-gray-300 focus:ring-xy-blue-500',
        ]"
        type="checkbox"
        v-bind="$attrs"
        @change="
          emits(
            'update:modelValue',
            ($event.target as HTMLInputElement).checked
          )
        "
      />
    </div>
    <div class="ml-3">
      <InputLabel
        :id="`${inputID}-label`"
        :for="inputID"
        :label="label"
        :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
        :required="isRequired"
      />
      <InputHelp :id="`${inputID}-help`" :text="help"></InputHelp>
    </div>
  </div>
</template>
