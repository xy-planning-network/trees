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
    v-bind="{
      ...$attrs,
      class: 'block my-1 text-sm font-semibold leading-snug text-gray-900',
    }"
    >{{ label }}</component
  >
</template>
