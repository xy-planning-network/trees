<script setup lang="ts">
withDefaults(
  defineProps<{
    text?: string
  }>(),
  {
    text: "",
  }
)
</script>

<template>
  <legend
    v-if="text"
    v-bind="{
      ...$attrs,
      class: 'text-base font-medium leading-tight text-gray-900',
    }"
  >
    {{ text }}
  </legend>
</template>
