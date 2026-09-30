<script setup lang="ts">
import { BadgeKind } from "@/composables/badge"
import { XMarkIcon } from "@heroicons/vue/solid"

withDefaults(defineProps<{ label: string; kind?: BadgeKind }>(), {
  kind: BadgeKind.Neutral,
})
defineEmits<{
  dismiss: [label: string]
}>()
</script>

<template>
  <span
    :class="[kind, 'flex items-center gap-x-1 group cursor-pointer']"
    @click="$emit('dismiss', label)"
  >
    <span class="flex-1 truncate">{{ label }}</span>
    <button
      type="button"
      class="group relative -mr-1.5 h-3.5 w-3.5 rounded-sm group-hover:bg-gray-500/10 inline-flex items-center justify-center"
    >
      <span class="sr-only">Remove</span>
      <XMarkIcon
        class="h-3 w-3 stroke-gray-500/20 group-hover:stroke-gray-500/75"
      />
      <!--makes the clickable target larger-->
      <span class="absolute -inset-2" />
    </button>
  </span>
</template>
