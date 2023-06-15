<script lang="ts" setup>
import Popover from "./Popover/Popover.vue"
import { InformationCircleIcon } from "@heroicons/vue/outline"
import { ref } from "vue"
import type { Placement } from "@floating-ui/vue"

// props
withDefaults(
  defineProps<{
    as?: string
    position?: Placement
  }>(),
  {
    as: "span",
    position: undefined,
  }
)

// refs
const popoverHover = ref(false)
const popoverTimeout = ref()

// functions
const closePopover = (close: () => void): void => {
  popoverHover.value = false
  if (popoverTimeout.value) clearTimeout(popoverTimeout.value)
  popoverTimeout.value = setTimeout(() => {
    if (!popoverHover.value) close()
  }, 100)
}

const hoverPopover = (e: MouseEvent, open: boolean): void => {
  popoverHover.value = true
  if (!open && e.target) (e.target as HTMLElement).click()
}
</script>

<template>
  <Popover :position="position" :as="as">
    <template #button="{ open, close }: { open: boolean, close: () => void }">
      <div
        class="leading-none relative w-4 h-4"
        @mouseover="hoverPopover($event, open)"
        @mouseleave="closePopover(close)"
      >
        <InformationCircleIcon />
        <!--creates a larger clickable surface area 40 x 40-->
        <div
          class="p-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        ></div>
      </div>
    </template>
    <template #default="{ close }: { close: () => void }">
      <div
        class="sm:min-w-max bg-white rounded-md px-3 py-2 border border-gray-100 drop-shadow-md text-xs text-gray-900 leading-snug font-medium"
        @mouseover.prevent="popoverHover = true"
        @mouseleave.prevent="closePopover(close)"
      >
        <div class="max-w-xs">
          <slot></slot>
        </div>
      </div>
    </template>
  </Popover>
</template>
