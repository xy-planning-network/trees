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
const emit = defineEmits(["update:model-value"])
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()
</script>

<template>
  <InputLabel
    :id="`${uuid}-label`"
    class="block"
    :for="uuid"
    :label="label"
  ></InputLabel>
  <textarea
    :id="uuid"
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
    :value="modelValue"
    v-bind="$attrs"
    @input="
      emit('update:model-value', ($event.target as HTMLInputElement).value)
    "
  />
  <InputHelp :id="`${uuid}-help`" :text="help"></InputHelp>
</template>
