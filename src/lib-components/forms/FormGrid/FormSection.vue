<script setup lang="ts">
import { computed, getCurrentInstance } from "vue"

withDefaults(
  defineProps<{
    description?: string
    title?: string
  }>(),
  {
    description: "",
    title: "",
  }
)

// reference the parent instance props
// to determine the layout mode we are in.
const layout = computed(() => {
  const i = getCurrentInstance()
  const parentLayout = i?.parent?.props?.columns
  if (typeof parentLayout !== "number") {
    return 1
  }

  if ([1, 2].includes(parentLayout)) {
    return parentLayout
  }

  return 1
})
</script>

<template>
  <div
    class="grid grid-cols-1 gap-x-8 border-b border-gray-900/10 pb-10 xl:grid-cols-3 last:border-none last:pb-0"
    :class="title || description ? 'gap-y-6' : 'gap-y-0'"
  >
    <div :class="layout == 2 ? 'xl:col-span-1' : 'xl:col-span-3'">
      <h3 v-if="title" class="text-base font-medium leading-8 text-gray-800">
        {{ title }}
      </h3>
      <p v-if="description" class="mt-1 text-sm leading-6 text-gray-600">
        {{ description }}
      </p>
    </div>

    <div
      class="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-12 [&>*:not(.xy-form-cell)]:col-span-full"
      :class="layout == 2 ? 'xl:col-span-2' : 'xl:col-span-3'"
    >
      <slot />
    </div>
  </div>
</template>
