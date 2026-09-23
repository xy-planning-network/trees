<script setup lang="ts">
import { useInlineMarkdown } from "@/composables/useInlineMarkdown"

const props = withDefaults(
  defineProps<{
    tag?: string
    text?: string
  }>(),
  {
    tag: "div",
    text: "",
  }
)

const nodes = useInlineMarkdown(() => props.text, {
  graphs: false,
})
</script>

<template>
  <component
    :is="tag"
    v-if="text"
    class="text-sm leading-6 font-normal text-gray-600"
    v-bind="$attrs"
  >
    <component :is="nodes" />
  </component>
</template>
