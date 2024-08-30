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
    tag: "legend",
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
    v-if="label"
    class="block text-sm leading-6 font-semibold text-gray-800"
    v-bind="$attrs"
  >
    {{ labelDisplay }}
    <span v-if="props.required" class="text-red-700/80">*</span>
  </component>
</template>
