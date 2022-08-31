<script setup lang="ts">
import Card from "@/lib-components/layout/Card.vue"
import { computed } from "vue"

type badgeType = "component" | "composable" | "css" | "none"

const props = withDefaults(
  defineProps<{
    badge?: badgeType
    title: string
  }>(),
  {
    badge: "component",
  }
)

const badge = computed(() => {
  switch (props.badge) {
    case "composable":
      return {
        type: "xy-badge-blue",
        name: "Composable",
      }
    case "component":
      return {
        type: "xy-badge-blue",
        name: "Vue Component",
      }
    case "css":
      return {
        type: "xy-badge-yello",
        name: "CSS Class Component",
      }
    default:
      return undefined
  }
})
</script>
<template>
  <Card>
    <template #title>
      {{ title }}
    </template>

    <template v-if="$slots['description']" #description>
      <slot name="description" />
    </template>

    <template #header-accessory>
      <div v-if="badge !== undefined">
        <span :class="badge.type">{{ badge.name }}</span>
      </div>
    </template>

    <div class="space-y-6">
      <slot />
    </div>
  </Card>
</template>
