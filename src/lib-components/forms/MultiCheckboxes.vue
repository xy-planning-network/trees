<script setup lang="ts">
import Uniques from "@/helpers/Uniques"
import { useAttrs } from "vue"
import Legend from "./Legend.vue"
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"

type CheckboxValue = string | number
type ModelValue = CheckboxValue[]

const props = withDefaults(
  defineProps<{
    options: {
      help?: string
      label: string
      value: string | number
    }[]
    help?: string
    legend?: string
    modelValue: ModelValue
  }>(),
  {
    help: "",
    legend: "",
  }
)

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValue): void
}>()
const attrs = useAttrs()
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()
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
  <fieldset class="space-y-5">
    <div class="space-y-0.5">
      <Legend :text="legend" />
      <InputHelp tag="p" :text="help" />
    </div>
    <div class="space-y-4">
      <div
        v-for="(option, index) in options"
        :key="option.value"
        class="relative flex items-start"
      >
        <div class="flex items-center h-5">
          <input
            :id="uuid"
            :aria-labelledby="`${uuid}-${index}-label`"
            :aria-describedby="
              option?.help && option.help ? `${uuid}-${index}-help` : undefined
            "
            :checked="modelValue.includes(option.value)"
            class="focus:ring-blue-500 h-4 w-4 text-blue-500 border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            type="checkbox"
            v-bind="{
              onChange: ($event) => { onChange(($event.target as HTMLInputElement).checked, option.value) },
            ...$attrs,
            }"
          />
        </div>
        <div class="ml-3">
          <InputLabel
            class="mt-auto"
            :id="`${uuid}-${index}-label`"
            :for="uuid"
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
  </fieldset>
</template>
