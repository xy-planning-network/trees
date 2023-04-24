<script lang="ts" setup>
import { TableActionItem } from "@/composables"
import { computed, isRef } from "vue"

const props = withDefaults(
  defineProps<{
    actions?: TableActionItem[]
  }>(),
  { actions: () => [] }
)

const actionItems = computed(() => {
  return props.actions.map((action) => {
    return {
      ...action,
      disabled: (() => {
        if (action.enable === undefined) {
          return false
        }

        if (isRef<boolean>(action.enable)) {
          return !action.enable.value
        }

        if (typeof action.enable === "boolean") {
          return !action.enable
        }

        return !action.enable()
      })(),
    }
  })
})
</script>

<template>
  <div class="flex items-center space-x-2 justify-end">
    <span class="isolate inline-flex rounded-md shadow-sm">
      <button
        v-for="(action, actionIdx) in actionItems"
        :key="actionIdx"
        type="button"
        class="group relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 disabled:text-gray-400 disabled:cursor-not-allowed"
        :class="{
          'rounded-l-md': actionIdx === 0,
          '-ml-px': actionIdx > 0,
          'rounded-r-md': actionIdx === actions.length - 1,
        }"
        :disabled="action.disabled"
        @click="action.event"
      >
        <span class="relative inline-flex items-center gap-x-1.5">
          <component
            :is="action.icon"
            v-if="action.icon"
            class="-ml-0.5 h-4 w-4 group-disabled:text-gray-300"
            :class="action.label ? 'text-gray-400' : 'text-gray-600'"
            aria-hidden="true"
          />
          {{ action.label }}
        </span>
      </button>
    </span>
  </div>
</template>
