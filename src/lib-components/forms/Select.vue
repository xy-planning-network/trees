<script setup lang="ts">
import Uniques from "@/helpers/Uniques"
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import { computed, useAttrs } from "vue"

const props = withDefaults(
  defineProps<{
    design?: "standard" | "compressed"
    label?: string
    help?: string
    placeholder?: string
    options: { label: string; value: string | number }[]
    modelValue: string | number // TODO: spk 4.0-rc test usage of undefined initial model value here.
  }>(),
  {
    design: "standard",
    label: "",
    help: "",
    placeholder: "Select an option",
  }
)

const emit = defineEmits(["update:modelValue"])
const attrs = useAttrs()
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()

const classes = computed((): string => {
  return (
    {
      standard:
        "mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
      compressed:
        "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm",
    } as any
  )[props.design]
})
</script>
<template>
  <InputLabel :id="`${uuid}-label`" :for="uuid" :label="label"></InputLabel>
  <select
    :aria-labelledby="label ? `${uuid}-label` : undefined"
    :aria-describedby="help ? `${uuid}-help` : undefined"
    :class="classes"
    :id="uuid"
    :value="modelValue"
    v-bind="{
      ...$attrs,
      onChange: ($event) => {
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      },
    }"
  >
    <option v-if="placeholder" value="" disabled selected>
      {{ placeholder }}
    </option>
    <option
      v-for="option in options"
      :value="option.value"
      v-text="option.label"
      :key="option.value"
    ></option>
  </select>
  <InputHelp :id="`${uuid}-help`" :text="help"></InputHelp>
</template>
