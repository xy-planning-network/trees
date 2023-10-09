<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import {
  useInputField,
  defaultInputProps,
  emailPattern,
  looseToNumber,
  passwordPattern,
  phonePattern,
} from "@/composables/forms"
import type { TextLikeInput } from "@/composables/forms"
import { computed } from "vue"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TextLikeInput>(), defaultInputProps)

const emit = defineEmits(["update:modelValue"])
const { inputID, isRequired } = useInputField()

const typeAttributes = computed(() => {
  switch (props.type) {
    case "number":
      return {
        max: Number.MAX_SAFE_INTEGER,
        min: Number.MIN_SAFE_INTEGER,
      }
    case "email":
      return {
        pattern: emailPattern,
      }
    case "password":
      return {
        pattern: passwordPattern,
      }
    case "tel":
      return {
        pattern: phonePattern,
      }
    default:
      return {}
  }
})

const onInput = (e: Event) => {
  let val = (e.target as HTMLInputElement).value

  if (props.type === "number") {
    val = looseToNumber(val)
  }

  emit("update:modelValue", val)
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
      :class="[
        'block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6',
        'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-700 disabled:ring-gray-200',
        error
          ? 'text-red-900 ring-red-700 placeholder:text-red-300 focus:ring-red-700'
          : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-xy-blue-500',
      ]"
      :placeholder="placeholder"
      :type="type"
      :value="modelValue"
      v-bind="{ ...typeAttributes, ...$attrs }"
      @input="onInput"
    />
    <InputHelp :id="`${inputID}-help`" class="mt-1" :text="help" />
  </div>
</template>
