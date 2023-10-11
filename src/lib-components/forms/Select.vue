<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import { defaultInputProps, useInputField } from "@/composables/forms"
import type { OptionsInput } from "@/composables/forms"
import { ref } from "vue"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<OptionsInput>(), {
  ...defaultInputProps,
  placeholder: "Select an option",
})

defineEmits(["update:modelValue", "update:error"])
const targetInput = ref<HTMLInputElement | null>(null)
const { inputID, isRequired, validate, modelState, errorState, onInvalid } =
  useInputField({ props, targetInput })

const onChange = (e: Event) => {
  modelState.value = (e.target as HTMLInputElement).value
  validate(e)
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
    <select
      :id="inputID"
      ref="targetInput"
      :aria-labelledby="label ? `${inputID}-label` : undefined"
      :aria-describedby="help ? `${inputID}-help` : undefined"
      :class="[
        'block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6 pl-3 pr-10',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-700 disabled:ring-gray-200 disabled:opacity-100',
        errorState
          ? 'text-red-900 ring-red-700 placeholder:text-red-300 focus:ring-red-700'
          : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-xy-blue-500',
      ]"
      :value="modelState"
      v-bind="$attrs"
      @change="onChange"
      @invalid="onInvalid"
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
    <div v-if="errorState" class="mt-0.5">
      <p class="text-sm text-red-700">{{ errorState }}</p>
    </div>
  </div>
</template>
