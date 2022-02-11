<script lang="ts">
export type PopoverPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"
  | "left"
  | "right"
  | "auto"
</script>
<script lang="ts" setup>
import { throttle } from "@/helpers/Throttle"
import {
  Popover as HeadlessPopover,
  PopoverButton as HeadlessPopoverButton,
  PopoverPanel as HeadlessPopoverPanel,
} from "@headlessui/vue"
import { computed, onMounted, onUnmounted, ref } from "vue"

const props = withDefaults(
  defineProps<{
    position?: PopoverPosition
  }>(),
  {
    position: "auto",
  }
)

const staticPosition = computed(() => {
  let wrapperClasses = ""
  let contentClasses = ""

  switch (props.position) {
    case "top-left":
      wrapperClasses =
        "top-0 left-0 -translate-y-full -translate-x-full justify-end"
      break
    case "top-center":
      wrapperClasses =
        "top-0 -translate-y-full -translate-x-full left-1/2 justify-end"
      contentClasses = "translate-x-1/2"
      break
    case "top-right":
      wrapperClasses = "top-0 -translate-y-full right-0 justify-end"
      contentClasses = "translate-x-full"
      break
    case "bottom-left":
      wrapperClasses = "top-full left-0 -translate-x-full justify-end"
      break
    case "bottom-center":
      wrapperClasses = "top-full -translate-x-full left-1/2 justify-end"
      contentClasses = "translate-x-1/2"
      break
    case "bottom-right":
      wrapperClasses = "top-full right-0 justify-end"
      contentClasses = "translate-x-full"
      break
    case "left":
      wrapperClasses =
        "top-1/2 left-0 -translate-y-1/2 -translate-x-full justify-end"
      break
    case "right":
      wrapperClasses = "top-1/2 -translate-y-1/2 right-0 justify-end"
      contentClasses = "translate-x-full"
      break
  }

  return {
    wrapper: wrapperClasses,
    content: contentClasses,
  }
})

const trigger = ref<typeof HeadlessPopoverButton>()
const wrapper = ref<typeof HeadlessPopoverPanel>()
const viewport = ref<{ vw: number; vh: number }>(getViewportDimensions())
const anchorRect = ref<DOMRect>()

const autoPosition = computed(() => {
  if (
    anchorRect.value === undefined ||
    wrapper.value === undefined ||
    !wrapper.value.el
  ) {
    return {}
  }
  const { vw, vh } = viewport.value

  const wrapRect = wrapper.value.el.getBoundingClientRect()
  const contentRect = wrapper.value.el.firstChild.getBoundingClientRect()
  const distToBottom = vh - anchorRect.value.bottom
  //NOTE: edge case - there may be more space bellow in viewport
  // but less document space for display
  // the inverse could also be true - but very rare
  const positionAbove = anchorRect.value.top > distToBottom
  const distToRight = vw - anchorRect.value.right
  const positionLeft = anchorRect.value.left > distToRight

  console.log(wrapRect, contentRect, anchorRect.value, vw)

  let xPos = 0
  if (positionLeft) {
    xPos = anchorRect.value.left * -1
    if (xPos < contentRect.width * -1) {
      xPos = (contentRect.width - anchorRect.value.width) * -1
    }
  } else {
    xPos = (contentRect.width - distToRight) * -1

    console.log(xPos)
    /*
    if (xPos < wrapRect.width * -1) {
      xPos = wrapRect.width * -1
    } else if (xPos > 0) {
      xPos = 0
    }
    */
  }

  return {
    wrapper: {
      top: positionAbove ? "auto" : `100%`,
      bottom: positionAbove ? "100%" : `auto`,
      transform: `translate3d(${anchorRect.value.left * -1}px, 0, 0)`,
      // left: `${anchorRect.value.left * -1}px`,
    },
    content: {
      transform: `translate3d(${positionLeft ? xPos : xPos}px, 0, 0)`,
    },
  }
})

const setPositions = () => {
  if (trigger.value === undefined) return
  anchorRect.value = trigger.value.el.getBoundingClientRect()

  viewport.value = getViewportDimensions()
}

function getViewportDimensions() {
  console.log(document.documentElement.clientWidth || 0, window.innerWidth || 0)
  return {
    vw: Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    ),
    vh: Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    ),
  }
}

const throttledSetPositions = throttle(setPositions)

onMounted(() => {
  setPositions()
  window.addEventListener("resize", throttledSetPositions)
  window.addEventListener("scroll", throttledSetPositions)
})

onUnmounted(() => {
  window.removeEventListener("resize", throttledSetPositions)
  window.removeEventListener("scroll", throttledSetPositions)
})
</script>

<template>
  <div class="flex">
    <HeadlessPopover v-slot="{ open, close }" class="relative leading-none">
      <HeadlessPopoverButton ref="trigger">
        <slot name="button" :open="open" :close="close"></slot>
      </HeadlessPopoverButton>

      <transition
        enter-active-class="transition-opacity transition-faster ease-out-quad"
        leave-active-class="transition-opacity transition-faster ease-in-quad"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <!--NOTE: use prop "static" for dev work to keep the tooptip visible-->
        <HeadlessPopoverPanel
          ref="wrapper"
          class="absolute z-10 transform w-screen flex px-4"
          :class="position === 'auto' ? '' : staticPosition.wrapper"
          :style="position === 'auto' ? autoPosition.wrapper : {}"
        >
          <div
            :class="position === 'auto' ? `left-0` : staticPosition.content"
            :style="position === 'auto' ? autoPosition.content : {}"
          >
            <slot :open="open" :close="close"></slot>
          </div>
        </HeadlessPopoverPanel>
      </transition>
    </HeadlessPopover>
  </div>
</template>
