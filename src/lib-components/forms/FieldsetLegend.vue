<script setup lang="ts">
import { hasSlotContent } from "@/helpers/Slots"
withDefaults(
  defineProps<{
    tag?: string
  }>(),
  {
    tag: "legend",
  }
)
</script>
<template>
  <component
    :is="tag"
    v-if="hasSlotContent($slots.default)"
    v-bind="{
      ...$attrs,
      class: 'text-base font-medium leading-tight text-gray-900',
    }"
  >
    <slot />
  </component>
</template>
