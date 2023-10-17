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
  <p v-if="text" class="text-sm text-red-700">{{ text }}</p>
</template>
