<script lang="ts" setup>
import Popover, { PopoverPosition } from "./Popover/Popover.vue"
import { InformationCircleIcon } from "@heroicons/vue/outline"
import { ref } from "vue"

// props
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

// refs
const popoverHover = ref(false)
const popoverTimeout = ref()

// functions
const closePopover = (close: any): void => {
  popoverHover.value = false
  if (popoverTimeout.value) clearTimeout(popoverTimeout.value)
  popoverTimeout.value = setTimeout(() => {
    if (!popoverHover.value) {
      close()
    }
  }, 100)
}

const hoverPopover = (e: MouseEvent, open: boolean): void => {
  popoverHover.value = true
  if (!open && e.target) (e.target as HTMLElement).click()
}
</script>

<template>
  <Popover :position="position" :as="as">
    <template #button="{ open, close }">
      <div class="leading-none w-4 h-4" @mouseover="hoverPopover($event, open)" @mouseleave="closePopover(close)">
        <InformationCircleIcon />
        <!--creates a larger clickable surface area 40 x 40-->
        <div
        class="p-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        ></div>
      </div>
    </template>
    <template #default="{open, close}">
      <div
        class="w-full max-w-xs bg-white rounded-md px-3 py-2 border border-gray-100 drop-shadow-md text-xs text-gray-900 leading-snug font-medium"
        @mouseover.prevent="popoverHover = true"
        @mouseleave.prevent="closePopover(close)"
      >
        <slot></slot>
      </div>
    </template>
  </Popover>
</template>
