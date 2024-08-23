<script lang="ts" setup>
import { useSlots, computed } from "vue"

withDefaults(defineProps<{ language?: "typescript" | "html" }>(), {
  language: "typescript",
})

const slots = useSlots()

const slotText = computed(() => {
  if (slots.default === undefined) {
    return ""
  }

  const raw = slots.default()[0].children
  if (raw === null || typeof raw !== "string") {
    return ""
  }

  return raw
})
</script>

<template>
  <pre><code v-highlight :class="language"><slot v-if="false" />{{slotText}}</code></pre>
</template>
