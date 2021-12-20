<script setup lang="ts">
import Uniques from "@/helpers/Uniques"
import { computed, useAttrs } from "vue"
import InputLabel from "./InputLabel.vue"
// TODO: fix - model value binding isn't updating

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    legend?: string
    name?: string
  }>(),
  {
    modelValue: undefined,
    legend: "",
    name: "",
  }
)
const emits = defineEmits(["update:modelValue"])
const attrs = useAttrs()
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()
const hasNameAttr = computed((): boolean => {
  return typeof props.name === "string" && props.name !== ""
})
</script>
<template>
  <fieldset>
    <InputLabel class="block" :label="legend" tag="legend"></InputLabel>
    <label
      class="inline-flex items-center"
      :class="{ 'cursor-not-allowed': $attrs.disabled }"
      :for="`${hasNameAttr ? name : uuid}-true`"
    >
      <input
        type="radio"
        class="w-4 h-4 border-gray-600 focus:ring-blue-500 text-xy-blue"
        :id="`${hasNameAttr ? name : uuid}-true`"
        :name="hasNameAttr ? name : uuid"
        :value="true"
        :checked="modelValue === true"
        v-bind="{
          ...$attrs,
          onChange: ($event) => {
            emits('update:modelValue', ($event.target as HTMLInputElement).value === 'true')
          },
        }"
      />
      <span class="block ml-2 text-sm font-semibold text-gray-900">Yes</span>
    </label>
    <label
      class="inline-flex items-center ml-6"
      :class="{ 'cursor-not-allowed': $attrs.disabled }"
      :for="`${hasNameAttr ? name : uuid}-false`"
    >
      <input
        type="radio"
        class="w-4 h-4 border-gray-600 focus:ring-blue-500 text-xy-blue"
        :id="`${hasNameAttr ? name : uuid}-false`"
        :name="hasNameAttr ? name : uuid"
        :value="false"
        :checked="modelValue === false"
        v-bind="{
          ...$attrs,
          onChange: ($event) => {
            emits('update:modelValue', ($event.target as HTMLInputElement).value === 'true')
          },
        }"
      />
      <span class="block ml-2 text-sm font-semibold text-gray-900">No</span>
    </label>
  </fieldset>
</template>
