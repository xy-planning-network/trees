<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    label?: string
    required?: boolean
    tag?: string
  }>(),
  {
    label: "",
    required: false,
    tag: "label",
  }
)

const labelDisplay = computed((): string => {
  if (!props.required) {
    return props.label
  }

  // remove trailing * on the existing label
  const regex = /\*$/gm

  if (regex.exec(props.label) !== null) {
    return props.label.substring(0, props.label.length - 1)
  }

  return props.label
})
</script>

<template>
  <component
    :is="tag"
    v-if="labelDisplay"
    class="block text-sm leading-snug font-medium text-gray-800"
    v-bind="$attrs"
  >
    {{ labelDisplay
    }}<span v-if="props.required" class="text-red-700/80" aria-hidden>*</span>
  </component>
</template>
