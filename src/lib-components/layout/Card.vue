<script lang="ts" setup>
withDefaults(
  defineProps<{
    compact?: boolean
  }>(),
  {
    compact: false,
  }
)
</script>

<template>
  <div
    class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200 flex flex-col"
  >
    <div
      v-if="$slots['title'] || $slots['header-accessory']"
      class="flex space-x-3"
      :class="{
        'px-3 py-3 sm:p-4': compact,
        'px-4 py-5 sm:px-6': !compact,
        'items-start': $slots['description'],
        'items-center': !$slots['description'],
      }"
    >
      <div v-if="$slots['title']" class="flex-1">
        <div
          class="leading-tight text-gray-900"
          :class="compact ? 'text-base font-semibold' : 'text-lg font-semibold'"
        >
          <slot name="title" />
        </div>

        <p v-if="$slots['description']" class="mt-1 text-sm text-gray-600">
          <slot name="description" />
        </p>
      </div>

      <div
        v-if="$slots['header-accessory']"
        class="flex-shrink-0 leading-none ml-auto"
      >
        <slot name="header-accessory" />
      </div>
    </div>
    <div
      class="flex-1"
      :class="compact ? 'px-3 py-4 sm:p-4' : 'px-4 py-5 sm:p-6'"
    >
      <slot />
    </div>
    <div
      v-if="$slots['footer'] || $slots['footer-accessory']"
      class="mb-0 mt-auto flex space-x-3"
      :class="compact ? 'px-3 py-2 sm:p-4' : 'px-4 py-4 sm:px-6'"
    >
      <div v-if="$slots['footer']" class="flex-1 mt-1 text-sm text-gray-500">
        <slot name="footer" />
      </div>

      <div
        v-if="$slots['footer-accessory']"
        class="flex-shrink-0 leading-none ml-auto"
      >
        <slot name="footer-accessory" />
      </div>
    </div>
  </div>
</template>
