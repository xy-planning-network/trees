<script setup lang="ts">
import { useInlineMarkdown } from "@/composables/useInlineMarkdown"

const props = defineProps<{ text: string }>()
const nodes = useInlineMarkdown(props.text)
</script>

<template>
  <component :is="nodes" v-if="text" />
</template>
