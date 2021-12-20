<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import Uniques from "@/helpers/Uniques"
import { useAttrs } from "vue"

// TODO: checkbox should support the help text prop - possibly as a tooltip
// TODO: aria-labelledby may be superfluous here since the input is wrapped in a label
withDefaults(
  defineProps<{
    emphasis?: boolean | null
    label?: string
    modelValue: boolean
  }>(),
  {
    emphasis: false,
    label: "",
  }
)
const emits = defineEmits(["update:modelValue"])
const attrs = useAttrs()
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()
</script>
<template>
  <div>
    <label class="inline-flex items-center">
      <input
        :aria-labelledby="label ? `${uuid}-label` : undefined"
        :checked="modelValue"
        class="focus:ring-blue-500 h-4 w-4 text-blue-500 border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        :id="uuid"
        type="checkbox"
        v-bind="{
          ...$attrs,
          onChange: ($event) => {
            emits('update:modelValue', ($event.target as HTMLInputElement).checked)
          },
        }"
      />
      <InputLabel
        class="ml-2"
        :id="`${uuid}-label`"
        :for="uuid"
        :label="label"
        tag="span"
      ></InputLabel>
    </label>
  </div>
</template>
