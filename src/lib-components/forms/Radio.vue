<script setup lang="ts">
import Uniques from "@/helpers/Uniques"
import { useAttrs } from "vue"
import InputLabel from "./InputLabel.vue"

// TODO: add horizontal layout support
const props = withDefaults(
  defineProps<{
    options: {
      label: string
      value: string
    }[]
    legend?: string
    modelValue?: string
    vertical?: boolean
  }>(),
  {
    legend: "",
    modelValue: "",
    vertical: true,
  }
)
const emits = defineEmits(["update:modelValue"])
const attrs = useAttrs()
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()
</script>
<template>
  <fieldset class="mt-1 space-y-2">
    <InputLabel class="block" :label="legend" tag="legend"></InputLabel>
    <component
      v-for="(option, index) in options"
      :key="option.value"
      :is="props.vertical ? 'div' : 'span'"
    >
      <label
        class="inline-flex items-center"
        :class="{ 'cursor-not-allowed': $attrs.disabled }"
        :for="`${uuid}-${index}`"
      >
        <input
          :checked="modelValue === option.value"
          class="w-4 h-4 border-gray-600 focus:ring-blue-500 text-xy-blue"
          :id="`${uuid}-${index}`"
          :name="uuid"
          type="radio"
          :value="option.value"
          v-bind="{
            ...$attrs,
            onChange: ($event) => {
              emits('update:modelValue', ($event.target as HTMLInputElement).value)
            },
          }"
        />
        <InputLabel class="ml-2" :label="option.label" tag="span"></InputLabel>
      </label>
    </component>
  </fieldset>
</template>
