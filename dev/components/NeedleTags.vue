<script setup lang="ts">
import type { Conifer } from "../domain/tree"

defineProps<{
  tree: Conifer
}>()

defineEmits<{
  (e: "clickLeaf", v: Conifer): void
}>()
</script>

<template>
  <div class="inline-flex items-center gap-x-1.5">
    <span
      class="xy-badge-blue cursor-pointer"
      @click.self.stop="$emit('clickLeaf', tree)"
    >
      {{ tree.leaf.type }}
    </span>
    <span class="xy-badge">
      {{ tree.leaf.length }}
    </span>
  </div>
</template>
