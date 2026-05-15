<script setup lang="ts">
import { ArrowDownTrayIcon } from "@heroicons/vue/solid"
defineProps<{
  propsData: Record<string, unknown>
  attribute: string
}>()
</script>
<template>
  <a :href="propsData[attribute] as string">
    <ArrowDownTrayIcon class="h-6 w-6 group-hover:text-gray-500 transition" />
  </a>
</template>
