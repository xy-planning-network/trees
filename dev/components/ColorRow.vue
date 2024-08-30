<script setup lang="ts">
import { computed } from "vue"

const props = defineProps<{
  colors: Record<string, string>
  name: string
  code: string
}>()
const colorList = computed(() => {
  const palette = props.colors
  if (palette["DEFAULT"]) {
    delete palette["DEFAULT"]
  }

  return palette
})
</script>

<template>
  <div class="2xl:contents">
    <div class="2xl:col-end-1 2xl:pt-2.5">
      <div class="text-sm font-semibold text-gray-900">{{ props.name }}</div>
      <div>
        <span class="xy-badge">{{ props.code }}</span>
      </div>
    </div>
    <div
      class="grid mt-3 grid-cols-1 sm:grid-cols-11 gap-y-3 gap-x-2 sm:mt-2 2xl:mt-0"
    >
      <div v-for="(hex, index) in colorList" :key="hex" class="relative flex">
        <div
          class="flex items-center gap-x-3 w-full cursor-pointer sm:block sm:space-y-1.5"
        >
          <div
            class="h-10 w-10 rounded dark:ring-1 dark:ring-inset dark:ring-white/10 sm:w-full"
            :style="`background-color: ${hex};`"
          ></div>
          <div class="px-0.5">
            <div
              class="w-6 font-medium text-xs text-slate-900 2xl:w-full dark:text-white"
            >
              {{ index }}
            </div>
            <div
              class="text-slate-500 text-xs font-mono lowercase dark:text-slate-400 sm:text-[0.625rem] md:text-xs lg:text-[0.625rem] 2xl:text-xs"
            >
              {{ hex }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
