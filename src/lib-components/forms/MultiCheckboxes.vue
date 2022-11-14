<script setup lang="ts">
import Uniques from "@/helpers/Uniques"
import { computed, useAttrs, useSlots } from "vue"
import FieldsetLegend from "./FieldsetLegend.vue"
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"

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
    legend?: string
    modelValue: ModelValue
    columns?: 2 | 3 | 4
  }>(),
  {
    help: "",
    legend: "",
    columns: undefined,
  }
)

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValue): void
}>()
const attrs = useAttrs()
const slots = useSlots()
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()
const hasLegend = computed(() => {
  return props.legend !== "" || slots.legend !== undefined
})
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

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <fieldset
    class="space-y-5"
    :aria-labelledby="hasLegend ? `${uuid}-legend` : undefined"
    :aria-describedby="help ? `${uuid}-help` : undefined"
  >
    <div v-if="hasLegend || help" class="space-y-0.5">
      <FieldsetLegend :id="`${uuid}-legend`">
        <div v-if="legend">{{ legend }}</div>
        <slot v-if="$slots.legend" name="legend"></slot>
      </FieldsetLegend>
      <InputHelp tag="p" :text="help" :id="`${uuid}-help`" />
    </div>
    <div class="flex">
      <div
        class="grid gap-4"
        :class="{
          'sm:grid sm:gap-y-4 sm:gap-x-5 sm:space-y-0': columns !== undefined,
          'sm:grid-cols-2': columns === 2,
          'sm:grid-cols-3': columns === 3,
          'sm:grid-cols-4': columns === 4,
        }"
      >
        <div
          v-for="(option, index) in options"
          :key="option.value"
          class="flex items-start"
        >
          <div class="flex items-center h-5">
            <input
              :id="`${uuid}-${index}`"
              :aria-labelledby="`${uuid}-${index}-label`"
              :aria-describedby="
                option?.help && option.help
                  ? `${uuid}-${index}-help`
                  : undefined
              "
              :checked="modelValue.includes(option.value)"
              :disabled="option.disabled === true ? true : undefined"
              class="focus:ring-blue-500 h-4 w-4 text-blue-500 border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              v-bind="{
              onChange: ($event) => { 
                onChange(($event.target as HTMLInputElement).checked, option.value)
              },
              ...$attrs,
              type: 'checkbox'
            }"
            />
          </div>
          <div class="ml-3">
            <InputLabel
              class="mt-auto"
              :disabled="
                ($attrs.hasOwnProperty('disabled') &&
                  $attrs.disabled !== false) ||
                option.disabled === true
              "
              :id="`${uuid}-${index}-label`"
              :for="`${uuid}-${index}`"
              :label="option.label"
            />
            <InputHelp
              class="-mt-1"
              :id="`${uuid}-${index}-help`"
              :text="option.help"
            />
          </div>
        </div>
      </div>
    </div>
  </fieldset>
</template>
