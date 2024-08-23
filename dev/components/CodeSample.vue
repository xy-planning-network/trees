<script lang="ts" setup>
import { useSlots, computed, ref, onMounted, onUpdated } from "vue"
import "highlight.js/styles/atom-one-dark.css"
import hljs from "highlight.js/lib/core"
import html from "highlight.js/lib/languages/xml"
import typescript from "highlight.js/lib/languages/typescript"

hljs.registerLanguage("html", html)
hljs.registerLanguage("typescript", typescript)

withDefaults(defineProps<{ language?: "typescript" | "html" }>(), {
  language: "typescript",
})

const codeBlock = ref<HTMLElement | null>(null)
const slots = useSlots()

const code = computed(() => {
  if (slots.default === undefined) {
    return ""
  }

  const raw = slots.default()[0].children
  if (raw === null || typeof raw !== "string") {
    return ""
  }

  return raw
})

const highlight = () => {
  if (codeBlock.value) {
    hljs.highlightElement(codeBlock.value)
  }
}

onMounted(highlight)
onUpdated(highlight)
</script>

<template>
  <pre><code ref="codeBlock" :class="`language-${language}`" v-text="code" /></pre>
  <span class="hidden"><slot /></span>
</template>
