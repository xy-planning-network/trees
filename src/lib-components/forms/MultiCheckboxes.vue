<script setup lang="ts">
import Uniques from "@/helpers/Uniques"
import { ref, useAttrs } from "vue"
import InputLabel from "./InputLabel.vue"

// TODO: checkbox should support the help text prop - possibly as a tooltip
// TODO: aria-labelledby may be superfluous here since the input is wrapped in a label

const props = withDefaults(
  defineProps<{
    options: {
      label: string
      value: string
    }[]
    legend?: string
    modelValue: string[]
  }>(),
  {
    legend: "",
  }
)

const emits = defineEmits(["update:modelValue"])
const attrs = useAttrs()
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()
const model = ref<string[]>(props.modelValue)
</script>
<template>
  <fieldset>
    <InputLabel class="block mb-0" :label="legend" tag="legend"></InputLabel>
    <div class="mt-4" v-for="(option, index) in options" :key="option.value">
      <label class="inline-flex items-center">
        <input
          type="checkbox"
          class="focus:ring-blue-500 h-4 w-4 text-xy-blue border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          :id="`${uuid}-${index}`"
          :value="option.value"
          v-model="model"
          v-bind="{
            ...$attrs,
            onChange: () => {
              emits('update:modelValue', model)
            },
          }"
        />
        <InputLabel
          class="ml-2"
          :for="`${uuid}-${index}`"
          :label="option.label"
          tag="span"
        ></InputLabel>
      </label>
    </div>
  </fieldset>
</template>
