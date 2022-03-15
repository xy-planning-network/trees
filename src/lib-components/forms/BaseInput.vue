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

const emit = defineEmits(["update:modelValue"])

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
    class="block"
    :id="`${uuid}-label`"
    :for="uuid"
    :label="label"
  ></InputLabel>
  <input
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
    :id="uuid"
    :placeholder="label"
    :type="type"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    v-bind="$attrs"
  />
  <InputHelp :id="`${uuid}-help`" :text="help"></InputHelp>
</template>
