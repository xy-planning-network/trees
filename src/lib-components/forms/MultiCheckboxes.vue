<script setup lang="ts">
import FieldsetLegend from "./FieldsetLegend.vue"
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import { useInputField, defaultInputProps } from "@/composables/forms"
import type { MultiChoiceInput, ColumnedInput } from "@/composables/forms"

defineOptions({
  inheritAttrs: false,
})

type CheckboxValue = string | number
type ModelValue = CheckboxValue[]

const props = withDefaults(
  defineProps<MultiChoiceInput & ColumnedInput>(),
  defaultInputProps
)

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValue): void
}>()

const { inputID, isDisabled } = useInputField()

const onChange = (checked: boolean, val: CheckboxValue) => {
  // TODO: test this undefined scenario
  let updateModelValue = props.modelValue ? [...props.modelValue] : []

  if (checked) {
    updateModelValue.push(val)
  } else {
    updateModelValue.splice(updateModelValue.indexOf(val), 1)
  }

  emit("update:modelValue", updateModelValue)
}
</script>

<template>
  <fieldset
    class="space-y-4"
    :aria-labelledby="label ? `${inputID}-legend` : undefined"
    :aria-describedby="help ? `${inputID}-help` : undefined"
  >
    <div v-if="label">
      <FieldsetLegend :id="`${inputID}-legend`" :label="label" />
      <InputHelp v-if="help" :id="`${inputID}-help`" tag="p" :text="help" />
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
                error
                  ? 'border-red-700 focus:ring-red-700'
                  : 'border-gray-300 focus:ring-xy-blue-500',
              ]"
              type="checkbox"
              v-bind="$attrs"
              @change="
                onChange(
                  ($event.target as HTMLInputElement).checked,
                  option.value
                )
              "
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
