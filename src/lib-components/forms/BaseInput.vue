<script setup lang="ts">
import Uniques from "@/helpers/Uniques"
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import { computed, useAttrs } from "vue"

const attrs = useAttrs()
const props = withDefaults(
  defineProps<{
    type: string
    help?: string
    label?: string
    modelValue?: string | number
  }>(),
  {
    help: "",
    label: "",
    modelValue: "",
  }
)

const emit = defineEmits(["update:model-value"])

const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()

/**
 * common text based inputs
 */
const textInputTypes = [
  "date",
  "datetime-local",
  "email",
  "month",
  "number",
  "password",
  "search",
  "tel",
  "text",
  "time",
  "url",
  "week",
]

/**
 * determine if this input is a common text based input
 */
const isTextType = computed((): boolean => {
  return typeof props.type === "string" && textInputTypes.includes(props.type)
})
</script>
<template>
  <InputLabel
    :id="`${uuid}-label`"
    class="block"
    :for="uuid"
    :label="label"
  ></InputLabel>
  <input
    :id="uuid"
    :aria-labelledby="label ? `${uuid}-label` : undefined"
    :aria-describedby="help ? `${uuid}-help` : undefined"
    :class="[
      ...['mt-1', 'sm:text-sm'],
      ...(isTextType
        ? [
            'block',
            'shadow-sm',
            'focus:ring-blue-500',
            'focus:border-blue-500',
            'border-gray-600',
            'rounded-md',
            'w-full',
            'disabled:opacity-70',
            'disabled:cursor-not-allowed',
          ]
        : []),
    ]"
    :placeholder="label"
    :type="type"
    :value="modelValue"
    v-bind="$attrs"
    @input="
      emit('update:model-value', ($event.target as HTMLInputElement).value)
    "
  />
  <InputHelp :id="`${uuid}-help`" :text="help"></InputHelp>
</template>
