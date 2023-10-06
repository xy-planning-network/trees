<script setup lang="ts">
import FieldsetLegend from "./FieldsetLegend.vue"
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import { useInputField } from "@/composables/forms"

defineOptions({
  inheritAttrs: false,
})

type CheckboxValue = string | number
type ModelValue = CheckboxValue[]

const props = withDefaults(
  defineProps<{
    options: {
      disabled?: boolean
      help?: string
      label: string
      value: CheckboxValue
    }[]
    help?: string
    label?: string
    modelValue: ModelValue
    columns?: 2 | 3
  }>(),
  {
    help: "",
    label: "",
    columns: undefined,
  }
)

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValue): void
}>()

const { inputID, isDisabled } = useInputField()

const onChange = (checked: boolean, val: CheckboxValue) => {
  let updateModelValue = [...props.modelValue]

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
    class="space-y-5"
    :aria-labelledby="label ? `${inputID}-legend` : undefined"
    :aria-describedby="help ? `${inputID}-help` : undefined"
  >
    <div v-if="label">
      <FieldsetLegend :id="`${inputID}-legend`" :label="label" />
      <InputHelp v-if="help" :id="`${inputID}-help`" tag="p" :text="help" />
    </div>

    <div class="flex">
      <div
        class="grid gap-y-5"
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
          <div class="flex items-center h-6">
            <input
              :id="`${inputID}-${index}`"
              :aria-labelledby="`${inputID}-${index}-label`"
              :aria-describedby="
                option.help ? `${inputID}-${index}-help` : undefined
              "
              :checked="modelValue.includes(option.value)"
              :disabled="option.disabled"
              :class="[
                'h-4 w-4 rounded',
                'border-gray-300 text-xy-blue focus:ring-xy-blue-500',
                'disabled:bg-gray-100 disabled:border-gray-200  disabled:cursor-not-allowed disabled:opacity-100',
                'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
              ]"
              type="checkbox"
              v-bind="{
              onChange: ($event) => { 
                onChange(($event.target as HTMLInputElement).checked, option.value)
              },
              ...$attrs,
            }"
            />
          </div>
          <div class="ml-3">
            <InputLabel
              :id="`${inputID}-${index}-label`"
              :for="`${inputID}-${index}`"
              :label="option.label"
              :class="(isDisabled || option.disabled) && 'cursor-not-allowed'"
            />
            <InputHelp :id="`${inputID}-${index}-help`" :text="option.help" />
          </div>
        </div>
      </div>
    </div>
  </fieldset>
</template>
