<script lang="ts" setup>
import Popover, { PopoverPosition } from "./Popover/Popover.vue"
import { InformationCircleIcon } from "@heroicons/vue/outline"

withDefaults(
  defineProps<{
    as?: string
    position?: PopoverPosition
  }>(),
  {
    as: "span",
    position: "auto",
  }
)
</script>

<template>
  <Popover :position="position" :as="as">
    <template #button>
      <div class="leading-none w-4 h-4">
        <InformationCircleIcon />
        <!--creates a larger clickable surface area 40 x 40-->
        <div
          class="p-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        ></div>
      </div>
    </template>
    <div
      class="w-full max-w-xs bg-white rounded-md px-3 py-2 border border-gray-100 drop-shadow-md text-xs text-gray-900 leading-snug font-medium"
    >
      <slot></slot>
    </div>
  </Popover>
</template>
