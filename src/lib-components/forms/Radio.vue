<script setup lang="ts">
import { computed, ref } from "vue"
import FieldsetLegend from "./FieldsetLegend.vue"
import InputHelp from "./InputHelp.vue"
import InputLabel from "./InputLabel.vue"
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

const radios = ref<HTMLInputElement[]>([])
// there are multiple radio buttons that could be the target
// for validation set to the first input
const targetInput = computed(() => {
  if (radios.value.length === 0) {
    return null
  }

  return radios.value[0]
})
const {
  errorState,
  modelState,
  inputID,
  isDisabled,
  isRequired,
  onInvalid,
  validate,
} = useInputField({ props, targetInput })

const onChange = (e: Event, val: string | number) => {
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
      <FieldsetLegend
        :id="`${inputID}-legend`"
        :label="label"
        :required="isRequired"
      />
      <InputHelp v-if="help" :id="`${inputID}-help`" tag="p" :text="help" />
    </div>

    <div v-if="errorState" class="mt-0.5">
      <p class="text-sm text-red-700">{{ errorState }}</p>
    </div>

    <div class="flex">
      <div
        class="grid gap-y-6"
        :class="{
          'sm:grid sm:gap-x-5 sm:space-y-0': columns !== undefined,
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
              ref="radios"
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
