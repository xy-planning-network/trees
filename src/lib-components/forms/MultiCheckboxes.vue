<script setup lang="ts">
import FieldsetLegend from "./FieldsetLegend.vue"
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import { useInputField, defaultInputProps } from "@/composables/forms"
import type { MultiChoiceInput, ColumnedInput } from "@/composables/forms"
import { computed, ref } from "vue"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<MultiChoiceInput & ColumnedInput>(),
  defaultInputProps
)

defineEmits(["update:modelValue", "update:error"])
const { aria, inputID, isDisabled, modelState, errorState, validate } =
  useInputField(props)

const onChange = (e: Event, val: string | number) => {
  const checked = (e.target as HTMLInputElement).checked

  if (!Array.isArray(modelState.value)) {
    modelState.value = []
  }

  if (checked) {
    modelState.value.push(val)
  } else {
    modelState.value.splice(modelState.value.indexOf(val), 1)
  }

  validate(e)
}

const selectionCount = computed(() => {
  if (Array.isArray(modelState.value)) {
    return modelState.value.length
  }

  return 0
})

const minCount = computed(() => {
  return props.min || null
})

const maxCount = computed(() => {
  return props.max || null
})

const countError = computed(() => {
  // min not reached, no max is set
  if (minCount.value !== null && selectionCount.value < minCount.value) {
    return `Please select at least ${minCount.value} of these options.`
  }

  // max is reached, no min set
  if (maxCount.value !== null && selectionCount.value > maxCount.value) {
    return `Please limit your selection to ${maxCount.value} of these options.`
  }

  // min and max are both set and at least on of them is out of range
  if (
    minCount.value !== null &&
    maxCount.value !== null &&
    (selectionCount.value < minCount.value ||
      selectionCount.value > maxCount.value)
  ) {
    return `Please select between ${minCount.value} and ${maxCount.value} of these options.`
  }

  return ""
})

const errorInput = ref<HTMLInputElement | null>(null)
const setValidationError = () => {
  if (!errorState.value) {
    errorState.value = countError.value
    // ensure the browser tooltip contains our error message
    errorInput.value?.setCustomValidity(countError.value)
  }
}
</script>

<template>
  <fieldset
    class="relative space-y-6"
    :aria-labelledby="aria.labelledby"
    :aria-describedby="aria.describedby"
    :aria-errormessage="aria.errormessage"
  >
    <div v-if="label">
      <FieldsetLegend
        :id="aria.labelledby"
        :label="label"
        :required="minCount ? true : false"
      />
      <InputHelp
        v-if="help"
        :id="aria.describedby"
        class="mt-1"
        tag="p"
        :text="help"
      />
      <InputError :id="aria.errormessage" class="mt-1" :text="errorState" />
    </div>

    <div class="flex">
      <div
        class="grid gap-y-5"
        :class="{
          'sm:grid sm:gap-x-10': columns !== undefined,
          'sm:grid-cols-2': columns === 2,
          'sm:grid-cols-3': columns === 3,
        }"
      >
        <div
          v-for="(option, index) in options"
          :key="option.value"
          class="flex items-start"
        >
          <div class="flex items-center h-5">
            <input
              :id="`${inputID}-${index}`"
              :aria-labelledby="`${inputID}-${index}-label`"
              :aria-describedby="
                option.help ? `${inputID}-${index}-help` : undefined
              "
              :checked="modelValue?.includes(option.value)"
              :disabled="option.disabled"
              :class="[
                'h-4 w-4 rounded cursor-pointer',
                'disabled:bg-gray-100 disabled:border-gray-200  disabled:cursor-not-allowed disabled:opacity-100',
                'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
                errorState
                  ? 'border-red-700 focus:ring-red-700'
                  : 'border-gray-300 focus:ring-xy-blue-500',
              ]"
              type="checkbox"
              v-bind="$attrs"
              @change="onChange($event, option.value)"
            />
          </div>
          <div class="ml-3">
            <InputLabel
              :id="`${inputID}-${index}-label`"
              :for="`${inputID}-${index}`"
              :label="option.label"
              :class="
                isDisabled || option.disabled
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer'
              "
            />
            <InputHelp :id="`${inputID}-${index}-help`" :text="option.help" />
          </div>
        </div>
      </div>
    </div>
    <!--Hidden input for custom validation-->
    <input
      v-if="countError"
      ref="errorInput"
      required
      class="sr-only top-1 left-1"
      aria-hidden
      type="checkbox"
      @invalid="setValidationError"
    />
  </fieldset>
</template>
