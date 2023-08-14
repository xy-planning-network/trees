<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import Uniques from "@/helpers/Uniques"
import { useAttrs } from "vue"

withDefaults(
  defineProps<{
    label?: string
    help?: string
    modelValue: boolean
  }>(),
  {
    label: "",
    help: "",
  }
)
const emits = defineEmits(["update:modelValue"])
const attrs = useAttrs()
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()
</script>
<template>
  <div class="relative flex items-start">
    <div class="flex items-center h-5">
      <input
        :id="uuid"
        :aria-labelledby="label ? `${uuid}-label` : undefined"
        :aria-describedby="help ? `${uuid}-help` : undefined"
        :checked="modelValue"
        class="focus:ring-xy-blue-500 h-4 w-4 text-xy-blue border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        type="checkbox"
        v-bind="{
          onChange: ($event) => {
            emits('update:modelValue', ($event.target as HTMLInputElement).checked)
          },
          ...$attrs,
        }"
      />
    </div>
    <div class="ml-3">
      <InputLabel
        :id="`${uuid}-label`"
        class="mt-auto"
        :disabled="
          $attrs.hasOwnProperty('disabled') && $attrs.disabled !== false
        "
        :for="uuid"
        :label="label"
      />
      <InputHelp :id="`${uuid}-help`" class="-mt-1" :text="help"></InputHelp>
    </div>
  </div>
</template>
