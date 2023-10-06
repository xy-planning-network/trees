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
    class="text-sm leading-snug font-normal text-gray-600"
    v-bind="$attrs"
  >
    {{ text }}
  </component>
</template>
