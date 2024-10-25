<script setup lang="ts">
import FieldsetLegend from "./FieldsetLegend.vue"
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import { useInputField, defaultInputProps } from "@/composables/forms"
import {
  MultiChoiceInput,
  ColumnedInput,
  defaultModelOpts,
} from "@/composables/forms"
import { computed, useTemplateRef } from "vue"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<MultiChoiceInput & ColumnedInput>(),
  defaultInputProps
)

const modelState = defineModel<MultiChoiceInput["modelValue"]>({
  ...defaultModelOpts,
  // NOTE(spk): Vue handling of explicit null props values vs undefined props values
  // means we can't rely on the the "default" param of defineModel here.  Ensuring the
  // getter returns an array type allows for a consistent checkbox v-model binding similar to
  // the example in the official Vue docs.
  //
  // When a parent component passes a null v-model the parent ref stays null until a mutation occurs
  // this is consistent with current input components.
  get: (v) => {
    if (!Array.isArray(v)) {
      return []
    }

    return v
  },
})

const { aria, inputID, isDisabled, errorState, validate } = useInputField(props)

const minCount = computed(() => {
  return props.min || null
})

const maxCount = computed(() => {
  return props.max || null
})

const countError = computed(() => {
  const count = modelState.value?.length || 0

  // min not reached, no max is set
  if (minCount.value !== null && count < minCount.value) {
    return `Please select at least ${minCount.value} of these options.`
  }

  // max is reached, no min set
  if (maxCount.value !== null && count > maxCount.value) {
    return `Please limit your selection to ${maxCount.value} of these options.`
  }

  // min and max are both set and at least on of them is out of range
  if (
    minCount.value !== null &&
    maxCount.value !== null &&
    (count < minCount.value || count > maxCount.value)
  ) {
    return `Please select between ${minCount.value} and ${maxCount.value} of these options.`
  }

  return ""
})

const errorInputRef = useTemplateRef("errorInput")
const setValidationError = () => {
  if (!errorState.value) {
    errorState.value = countError.value
    // ensure the browser tooltip contains our error message
    errorInputRef.value?.setCustomValidity(countError.value)
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
              v-model="modelState"
              :aria-labelledby="`${inputID}-${index}-label`"
              :aria-describedby="
                option.help ? `${inputID}-${index}-help` : undefined
              "
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
              :value="option.value"
              v-bind="$attrs"
              @change="validate"
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
