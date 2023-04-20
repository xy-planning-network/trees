<script setup lang="ts">
defineProps<{
  cards: {
    primary: string
    secondary: string
  }[]
}>()
</script>
<template>
  <div
    class="mt-5 grid grid-cols-1 gap-5"
    :class="'lg:grid-cols-' + cards.length"
  >
    <div
      v-for="(card, idx) in cards"
      :key="idx"
      class="bg-white overflow-hidden shadow rounded-lg"
    >
      <div class="px-4 py-5 sm:p-6 text-center">
        <dl>
          <dd
            class="mt-1 text-3xl leading-9 font-semibold text-xy-blue"
            v-text="card.primary"
          ></dd>
          <dt
            class="text-sm leading-5 font-medium text-gray-700 truncate"
            v-text="card.secondary"
          ></dt>
        </dl>
      </div>
    </div>
  </div>
</template>
