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
    modelValue: boolean
  }>(),
  {
    label: "",
    help: "",
  }
)
const emits = defineEmits(["update:modelValue"])
const { inputID, isDisabled, isValid } = useInputField()
</script>

<template>
  <div class="relative flex items-start">
    <div class="flex items-center h-6">
      <input
        :id="inputID"
        :aria-labelledby="label ? `${inputID}-label` : undefined"
        :aria-describedby="help ? `${inputID}-help` : undefined"
        :checked="modelValue"
        :class="[
          'h-4 w-4 rounded',
          'border-gray-300 text-xy-blue',
          'disabled:bg-gray-100 disabled:border-gray-200  disabled:cursor-not-allowed disabled:opacity-100',
          'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
          isValid ? 'focus:ring-xy-blue-500' : 'focus:ring-red-700',
        ]"
        type="checkbox"
        v-bind="{
          onChange: ($event) => {
            emits('update:modelValue', ($event.target as HTMLInputElement).checked)
          },
          ...$attrs,
        }"
      />
    </div>
    <div class="ml-3">
      <InputLabel
        :id="`${inputID}-label`"
        :for="inputID"
        :label="label"
        :class="isDisabled && 'cursor-not-allowed'"
      />
      <InputHelp :id="`${inputID}-help`" :text="help"></InputHelp>
    </div>
  </div>
</template>
