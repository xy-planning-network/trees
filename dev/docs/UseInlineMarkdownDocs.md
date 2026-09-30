#### useInlineMarkdown

```ts
<script setup lang="ts">
import { useInlineMarkdown } from "@/composables/useInlineMarkdown"

const props = defineProps<{
	text: string
}>()

// Maintain reactivity with a getter on props.
const nodes = useInlineMarkdown(() => props.text, {
  graphs: false,
})
</script>

<template>
  <p class="text-sm leading-6 font-normal text-gray-600">
    <component :is="nodes" />
  </p>
</template>
```
