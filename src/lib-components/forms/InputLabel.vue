<script setup lang="ts">
withDefaults(
  defineProps<{
    disabled?: boolean
    label?: string
    tag?: string
  }>(),
  {
    disabled: false,
    label: "",
    tag: "label",
  }
)
</script>
<template>
  <component
    :is="tag"
    v-if="label"
    :class="{
      'block my-1 text-sm font-semibold leading-snug text-gray-900': true,
      'opacity-75': disabled,
    }"
    v-bind="{
      ...$attrs,
    }"
    >{{ label }}</component
  >
</template>
