<script setup lang="ts">
import Uniques from "@/helpers/Uniques"
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import { useAttrs } from "vue"
withDefaults(
  defineProps<{
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
const attrs = useAttrs()
const emit = defineEmits(["update:modelValue"])
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()
</script>

<template>
  <InputLabel
    class="block"
    :id="`${uuid}-label`"
    :for="uuid"
    :label="label"
  ></InputLabel>
  <textarea
    :aria-labelledby="label ? `${uuid}-label` : undefined"
    :aria-describedby="help ? `${uuid}-help` : undefined"
    :class="[
      'mt-1',
      'sm:text-sm',
      'block',
      'shadow-sm',
      'focus:ring-blue-500',
      'focus:border-blue-500',
      'border-gray-600',
      'rounded-md',
      'w-full',
      'disabled:opacity-70',
      'disabled:cursor-not-allowed',
    ]"
    :id="uuid"
    :value="modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    v-bind="$attrs"
  />
  <InputHelp :id="`${uuid}-help`" :text="help"></InputHelp>
</template>
