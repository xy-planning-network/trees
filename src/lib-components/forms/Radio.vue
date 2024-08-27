<script setup lang="ts">
import FieldsetLegend from "./FieldsetLegend.vue"
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import { useInputField, defaultInputProps } from "@/composables/forms"
import type { OptionsInput, ColumnedInput } from "@/composables/forms"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<OptionsInput & ColumnedInput>(),
  defaultInputProps
)

defineEmits(["update:modelValue", "update:error"])

const {
  aria,
  errorState,
  modelState,
  inputID,
  isDisabled,
  isRequired,
  onInvalid,
  validate,
} = useInputField(props)

const onChange = (e: Event, val: string | number) => {
  modelState.value = val
  validate(e)
}
</script>

<template>
  <fieldset
    class="space-y-6"
    :aria-labelledby="aria.labelledby"
    :aria-describedby="aria.describedby"
    :aria-errormessage="aria.errormessage"
  >
    <div v-if="label">
      <FieldsetLegend
        :id="aria.labelledby"
        :label="label"
        :required="isRequired"
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
              :aria-describedby="
                option.help ? `${inputID}-${index}-help` : undefined
              "
              :aria-labelledby="`${inputID}-${index}-label`"
              :checked="modelState === option.value"
              :class="[
                'h-4 w-4 cursor-pointer text-xy-blue',
                'disabled:bg-gray-100 disabled:border-gray-200  disabled:cursor-not-allowed disabled:opacity-100',
                'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
                errorState
                  ? 'border-red-700 focus:ring-red-700'
                  : 'border-gray-300  focus:ring-xy-blue-500',
              ]"
              :disabled="option.disabled"
              :name="inputID"
              type="radio"
              :value="option.value"
              v-bind="$attrs"
              @change="onChange($event, option.value)"
              @invalid="onInvalid"
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
  </fieldset>
</template>
