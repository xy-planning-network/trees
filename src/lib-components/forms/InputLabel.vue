<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    tag?: string
  }>(),
  {
    label: "",
    tag: "label",
  }
)
</script>

<template>
  <component
    :is="tag"
    v-if="label"
    class="block text-sm leading-snug font-medium text-gray-800"
    v-bind="$attrs"
  >
    {{ label }}
  </component>
</template>
