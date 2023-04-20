<script setup lang="ts">
import { DownloadIcon } from "@heroicons/vue/solid"
defineProps<{
  row: Record<string, unknown>
}>()
</script>
<template>
  <a href="#" class="float-right">
    <DownloadIcon
      class="h-6 w-6 group-hover:text-gray-500 transition text-right"
      text-anchor="end"
    />
  </a>
</template>
