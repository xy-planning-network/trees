<script setup lang="ts">
withDefaults(
  defineProps<{
    showBadge?: boolean
    cssComponent?: boolean
    title: string
  }>(),
  {
    showBadge: true,
    cssComponent: false,
  }
)
</script>
<template>
  <div class="bg-white shadow rounded-lg divide-y divide-gray-200">
    <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
      <div
        class="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap"
      >
        <div class="ml-4 mt-4">
          <h3
            class="text-lg leading-6 font-medium text-gray-900"
            v-text="title"
          ></h3>
          <p class="mt-1 text-sm text-gray-700">
            <slot name="description"></slot>
          </p>
        </div>
        <div v-if="showBadge" class="ml-4 mt-4 flex-shrink-0">
          <span v-if="cssComponent" class="xy-badge-yellow">
            CSS Class Component
          </span>
          <span v-else class="xy-badge-blue"> Vue Component </span>
        </div>
      </div>
    </div>
    <div class="px-4 py-5 sm:p-6 space-y-6">
      <slot></slot>
    </div>
  </div>
</template>
