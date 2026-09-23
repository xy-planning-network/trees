<script setup lang="ts">
import BaseAPI from "../components/BaseAPI.vue"
import UseBaseAPI from "../components/UseBaseAPI.vue"
import UseUrlSearchParams from "../components/UseUrlSearchParams.vue"
import UseInlineMarkdown from "../components/UseInlineMarkdown.vue"
</script>

<template>
  <div class="docs-page-wrapper">
    <BaseAPI />
    <UseBaseAPI />
    <UseInlineMarkdown />
    <UseUrlSearchParams />
  </div>
</template>
