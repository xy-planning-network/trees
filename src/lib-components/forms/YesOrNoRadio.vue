<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
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
  inputID,
  isDisabled,
  isRequired,
  nameAttr,
  modelState,
  errorState,
  onInvalid,
  validate,
} = useInputField({ props, targetInput })

const onChange = (e: Event, val: boolean) => {
  modelState.value = val
  validate(e)
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

    <div v-if="errorState" class="mt-0.5">
      <p class="text-sm text-red-700">{{ errorState }}</p>
    </div>

    <div>
      <label
        class="inline-flex items-center group"
        :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
        :for="`${nameAttr}-true`"
      >
        <input
          :id="`${nameAttr}-true`"
          rel="targetInput"
          type="radio"
          :class="[
            'h-4 w-4 text-xy-blue cursor-pointer',
            'disabled:bg-gray-100 disabled:border-gray-200  disabled:cursor-not-allowed disabled:opacity-100',
            'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
            errorState
              ? 'border-red-700 focus:ring-red-700'
              : 'border-gray-300  focus:ring-xy-blue-500',
          ]"
          :name="nameAttr"
          :value="true"
          :checked="modelState === true"
          v-bind="$attrs"
          @change="onChange($event, true)"
          @invalid="onInvalid"
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
            errorState
              ? 'border-red-700 focus:ring-red-700'
              : 'border-gray-300  focus:ring-xy-blue-500',
          ]"
          :name="nameAttr"
          :value="false"
          :checked="modelState === false"
          v-bind="$attrs"
          @change="onChange($event, false)"
          @invalid="onInvalid"
        />
        <InputLabel class="ml-3" label="No" tag="span" />
      </label>
    </div>
  </fieldset>
</template>
