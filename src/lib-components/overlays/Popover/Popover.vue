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
  | "none"
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
    as?: string
    position?: PopoverPosition
  }>(),
  {
    as: "div",
    position: "auto",
  }
)

const getViewportDimensions = () => {
  return {
    vw: document.documentElement.clientWidth,
    vh: document.documentElement.clientHeight,
  }
}

const trigger = ref<typeof HeadlessPopoverButton>()
const wrapper = ref<typeof HeadlessPopoverPanel>()
const viewport = ref<{ vw: number; vh: number }>(getViewportDimensions())

const classes = computed(() => {
  const classes = {
    wrapper: "",
    content: "",
  }

  if (props.position === "none") {
    return classes
  }

  // defaults classes when positioning
  classes.wrapper = "h-0 flex w-screen"
  classes.content = "absolute"

  // merge static positioning classes
  if (props.position !== "auto") {
    classes.wrapper += ` ${staticPosition.value.wrapper}`
    classes.content += ` ${staticPosition.value.content}`
  }

  return classes
})

const staticPosition = computed(() => {
  let wrapperClasses = ""
  let contentClasses = ""

  switch (props.position) {
    case "top-left":
      wrapperClasses = "top-0 right-0 -translate-y-full justify-end"
      contentClasses = "bottom-full"
      break
    case "top-center":
      wrapperClasses =
        "top-0 -translate-y-full -translate-x-full left-1/2 justify-end"
      contentClasses = "bottom-full translate-x-1/2"
      break
    case "top-right":
      wrapperClasses =
        "top-0 -translate-y-full left-0 -translate-x-full justify-end"
      contentClasses = "bottom-full translate-x-full"
      break
    case "bottom-left":
      wrapperClasses = "top-full right-0 justify-end"
      contentClasses = "top-full"
      break
    case "bottom-center":
      wrapperClasses = "top-full -translate-x-full left-1/2 justify-end"
      contentClasses = "top-full translate-x-1/2"
      break
    case "bottom-right":
      wrapperClasses = "top-full left-0 -translate-x-full justify-end"
      contentClasses = "top-full translate-x-full"
      break
    case "left":
      wrapperClasses =
        "top-1/2 left-0 -translate-y-1/2 -translate-x-full justify-end"
      contentClasses = "-translate-y-1/2"
      break
    case "right":
      wrapperClasses = "top-1/2 -translate-y-1/2 right-0 justify-end"
      contentClasses = "translate-x-full -translate-y-1/2"
      break
  }

  return {
    wrapper: wrapperClasses,
    content: contentClasses,
  }
})

const autoPosition = computed(() => {
  if (!wrapper?.value?.el || !trigger?.value?.el) {
    return {}
  }

  const { vw, vh } = viewport.value

  // avoid bumping up against the edge of the browser when possible
  const offset = 10

  // base the anchor rectangle off of the entire trigger dom element to move around it
  const anchorRect: DOMRect = trigger.value.el.getBoundingClientRect()
  // the content rectangle is best calculated by our first child (content) element inside the wrapper
  const contentRect: DOMRect =
    wrapper.value.el.firstChild.getBoundingClientRect()
  const distToBottom = vh - anchorRect.bottom
  // NOTE: edge case - there may be more space below in the viewport
  // but less document space for display
  // the inverse could also be true - but will be very rare
  // occurring with unreasonably large popover content
  const positionAbove = anchorRect.top > distToBottom
  const distToRight = vw - anchorRect.left
  const flowLeft = anchorRect.left > distToRight

  // translate the content container on the x axis to the correct position
  // considering the flow the content should take
  let xPos = 0
  if (flowLeft) {
    if (contentRect.width > anchorRect.right) {
      xPos =
        anchorRect.right -
        contentRect.width +
        (contentRect.width - anchorRect.right)
    } else {
      xPos = anchorRect.right - contentRect.width
    }

    if (vw > contentRect.width + offset) {
      xPos = xPos + offset
    }
  } else {
    if (contentRect.width > distToRight) {
      xPos = anchorRect.left - (contentRect.width - distToRight)
    } else {
      xPos = anchorRect.left
    }

    if (vw > contentRect.width + offset) {
      xPos = xPos - offset
    }
  }

  return {
    wrapper: {
      top: positionAbove ? "auto" : `100%`,
      bottom: positionAbove ? "100%" : `auto`,
      transform: `translate(${anchorRect.left * -1}px, 0)`, // pin to left of window
      width: `${vw}px`,
    },
    content: {
      top: positionAbove ? "auto" : `100%`,
      bottom: positionAbove ? "100%" : `auto`,
      transform: `translate(${xPos}px, 0)`,
    },
  }
})

if (props.position === "auto") {
  const throttledSetPositions = throttle(() => {
    viewport.value = getViewportDimensions()
  })

  onMounted(() => {
    window.addEventListener("resize", throttledSetPositions)
    window.addEventListener("scroll", throttledSetPositions)
  })

  onUnmounted(() => {
    window.removeEventListener("resize", throttledSetPositions)
    window.removeEventListener("scroll", throttledSetPositions)
  })
}
</script>

<template>
  <HeadlessPopover v-slot="{ open, close }" class="relative flex" :as="as">
    <HeadlessPopoverButton ref="trigger">
      <slot name="button" :open="open" :close="close"></slot>
    </HeadlessPopoverButton>

    <transition
      enter-active-class="transition-opacity transition-faster ease-out-quad"
      leave-active-class="transition-opacity transition-fastest ease-in-quad"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <HeadlessPopoverPanel
        ref="wrapper"
        class="absolute z-10"
        :class="classes.wrapper"
        :style="position === 'auto' ? autoPosition.wrapper : {}"
      >
        <div
          :class="classes.content"
          :style="position === 'auto' ? autoPosition.content : {}"
        >
          <slot :open="open" :close="close"></slot>
        </div>
      </HeadlessPopoverPanel>
    </transition>
  </HeadlessPopover>
</template>
