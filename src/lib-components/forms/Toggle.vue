<script setup lang="ts">
import { Switch } from "@headlessui/vue"

withDefaults(defineProps<{ modelValue: boolean }>(), { modelValue: false })
const emits = defineEmits(["update:modelValue"])
</script>
<template>
  <Switch
    :class="[
      modelValue ? 'bg-blue-600' : 'bg-gray-200',
      'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    ]"
    :modelValue="modelValue"
    @update:modelValue="emits('update:modelValue', $event)"
  >
    <span class="sr-only">Use</span>
    <span
      aria-hidden="true"
      :class="[
        modelValue ? 'translate-x-5' : 'translate-x-0',
        'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
      ]"
    />
  </Switch>
</template>