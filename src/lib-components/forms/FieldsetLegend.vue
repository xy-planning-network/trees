<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    tag?: string
  }>(),
  {
    label: "",
    tag: "legend",
  }
)
</script>

<template>
  <component
    :is="tag"
    v-if="label"
    class="block text-base/6 font-medium text-gray-800"
    v-bind="$attrs"
  >
    {{ label }}
  </component>
</template>
