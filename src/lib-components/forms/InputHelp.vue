<script setup lang="ts">
withDefaults(
  defineProps<{
    tag?: string
    text?: string
  }>(),
  {
    tag: "div",
    text: "",
  }
)
</script>
<template>
  <component
    :is="tag"
    v-if="text"
    v-bind="{
      ...$attrs,
      class: 'mt-2 text-sm leading-snug font-semibold text-gray-700',
    }"
  >
    {{ text }}
  </component>
</template>
