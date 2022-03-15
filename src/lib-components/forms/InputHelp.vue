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
      class: 'mt-1 text-sm leading-snug font-normal text-gray-700',
    }"
  >
    {{ text }}
  </component>
</template>
