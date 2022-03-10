<script setup lang="ts">
import Uniques from "@/helpers/Uniques"
import { useAttrs } from "vue"
import Legend from "./Legend.vue"
import InputHelp from "./InputHelp.vue"
import InputLabel from "./InputLabel.vue"

withDefaults(
  defineProps<{
    options: {
      help?: string
      label: string
      value: string | number
    }[]
    help?: string
    legend?: string
    modelValue?: string | number
    columns?: 2 | 3
  }>(),
  {
    help: "",
    legend: "",
    modelValue: undefined,
    columns: undefined,
  }
)
const emits = defineEmits(["update:modelValue"])
const attrs = useAttrs()
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()
</script>
<template>
  <fieldset class="space-y-5">
    <div class="space-y-0.5">
      <Legend :text="legend" />
      <InputHelp tag="p" :text="help" />
    </div>
    <div
      class="grid gap-4"
      :class="{
        'sm:grid sm:gap-y-4 sm:gap-x-5 sm:space-y-0': columns !== undefined,
        'sm:grid-cols-2': columns === 2,
        'sm:grid-cols-3': columns === 3,
      }"
    >
      <div
        v-for="(option, index) in options"
        :key="option.value"
        class="flex items-start"
      >
        <div class="flex items-center h-5">
          <input
            :checked="modelValue === option.value"
            class="w-4 h-4 border-gray-600 focus:ring-blue-500 text-xy-blue disabled:opacity-50 disabled:cursor-not-allowed"
            :id="`${uuid}-${index}`"
            :name="uuid"
            type="radio"
            :value="option.value"
            v-bind="{
              ...$attrs,
              onChange: () => {
                emits('update:modelValue', option.value)
              },
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
