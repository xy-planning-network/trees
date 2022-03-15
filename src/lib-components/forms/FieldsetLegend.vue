<script setup lang="ts">
import { hasSlotContent } from "@/helpers/Slots"
</script>
<template>
  <legend
    v-if="hasSlotContent($slots.default)"
    v-bind="{
      ...$attrs,
      class: 'text-base font-medium leading-tight text-gray-900',
    }"
  >
    <slot />
  </legend>
</template>
