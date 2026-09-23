<script setup lang="ts">
import { useInlineMarkdown } from "@/composables/useInlineMarkdown"
import { computed, getCurrentInstance } from "vue"

const props = withDefaults(
  defineProps<{
    description?: string
    title?: string
  }>(),
  {
    description: "",
    title: "",
  }
)
const currentInstance = getCurrentInstance()
// reference the parent instance props
// to determine the layout mode we are in.
const layout = computed(() => {
  const parentLayout = currentInstance?.parent?.props?.columns
  if (typeof parentLayout !== "number") {
    return 1
  }

  if ([1, 2].includes(parentLayout)) {
    return parentLayout
  }

  return 1
})

const descriptionNodes = useInlineMarkdown(() => props.description, {
  graphs: true,
})
</script>

<template>
  <div
    class="grid grid-cols-1 gap-x-8 border-b border-gray-900/10 pb-10 xl:grid-cols-3 last:border-none last:pb-0"
    :class="title || description ? 'gap-y-6' : 'gap-y-0'"
  >
    <div :class="layout == 2 ? 'xl:col-span-1' : 'xl:col-span-3'">
      <h3 v-if="title" class="text-base font-semibold leading-8 text-gray-800">
        {{ title }}
      </h3>
      <div v-if="description" class="mt-1 text-sm leading-6 text-gray-600">
        <component :is="descriptionNodes" />
      </div>
    </div>

    <div
      class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12 [&>*:not(.xy-form-cell)]:col-span-full"
      :class="layout == 2 ? 'xl:col-span-2' : 'xl:col-span-3'"
    >
      <slot />
    </div>
  </div>
</template>
