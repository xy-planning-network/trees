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
const { inputID, isDisabled, isRequired, nameAttr } = useInputField()

const onChange = (e: Event) => {
  emits("update:modelValue", (e.target as HTMLInputElement).value === "true")
}
</script>

<template>
  <fieldset
    class="space-y-4"
    :aria-labelledby="label ? `${inputID}-legend` : undefined"
    :aria-describedby="help ? `${inputID}-help` : undefined"
  >
    <div v-if="label">
      <InputLabel
        class="block my-auto"
        :label="label"
        tag="legend"
        :required="isRequired"
      />
      <InputHelp v-if="help" :id="`${inputID}-help`" tag="p" :text="help" />
    </div>

    <div>
      <label
        class="inline-flex items-center group"
        :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
        :for="`${nameAttr}-true`"
      >
        <input
          :id="`${nameAttr}-true`"
          type="radio"
          :class="[
            'h-4 w-4 text-xy-blue cursor-pointer',
            'disabled:bg-gray-100 disabled:border-gray-200  disabled:cursor-not-allowed disabled:opacity-100',
            'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
            error
              ? 'border-red-700 focus:ring-red-700'
              : 'border-gray-300  focus:ring-xy-blue-500',
          ]"
          :name="nameAttr"
          :value="true"
          :checked="modelValue === true"
          v-bind="{
            ...$attrs,
            onChange: onChange,
          }"
        />
        <InputLabel class="ml-3" label="Yes" tag="span" />
      </label>

      <label
        class="inline-flex items-center ml-6"
        :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
        :for="`${nameAttr}-false`"
      >
        <input
          :id="`${nameAttr}-false`"
          type="radio"
          :class="[
            'h-4 w-4 text-xy-blue cursor-pointer',
            'disabled:bg-gray-100 disabled:border-gray-200  disabled:cursor-not-allowed disabled:opacity-100',
            'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
            error
              ? 'border-red-700 focus:ring-red-700'
              : 'border-gray-300  focus:ring-xy-blue-500',
          ]"
          :name="nameAttr"
          :value="false"
          :checked="modelValue === false"
          v-bind="{
            ...$attrs,
            onChange: onChange,
          }"
        />
        <InputLabel class="ml-3" label="No" tag="span" />
      </label>
    </div>
  </fieldset>
</template>
