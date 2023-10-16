<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import { useInputField, defaultInputProps } from "@/composables/forms"
import type { BooleanInput } from "@/composables/forms"
import { ref } from "vue"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<BooleanInput>(), defaultInputProps)

defineEmits(["update:modelValue", "update:error"])
const targetInput = ref<HTMLInputElement | null>(null)
const {
  aria,
  inputID,
  isDisabled,
  isRequired,
  errorState,
  modelState,
  validate,
  onInvalid,
} = useInputField({ props, targetInput })

const onChange = (e: Event) => {
  modelState.value = (e.target as HTMLInputElement).checked
  validate(e)
}
</script>

<template>
  <div class="relative flex items-start">
    <div class="flex items-center h-5">
      <input
        :id="inputID"
        ref="targetInput"
        :aria-labelledby="aria.labelledby"
        :aria-describedby="aria.describedby"
        :aria-errormessage="aria.errormessage"
        :checked="modelState || undefined"
        :class="[
          'h-4 w-4 rounded text-xy-blue cursor-pointer',
          'disabled:bg-gray-100 disabled:border-gray-200  disabled:cursor-not-allowed disabled:opacity-100',
          'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
          errorState
            ? 'border-red-700 focus:ring-red-700'
            : 'border-gray-300 focus:ring-xy-blue-500',
        ]"
        type="checkbox"
        v-bind="$attrs"
        @change="onChange"
        @invalid="onInvalid"
      />
    </div>
    <div class="ml-3">
      <InputLabel
        :id="aria.labelledby"
        :for="inputID"
        :label="label"
        :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
        :required="isRequired"
      />
      <InputHelp :id="aria.describedby" :text="help"></InputHelp>
      <InputError :id="aria.errormessage" class="mt-0.5" :text="errorState" />
    </div>
  </div>
</template>
