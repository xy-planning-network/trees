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
    position: "top-center",
  }
)

const positionClasses = computed(() => {
  // NOTE: by always pushing the screen width wrapper classes to the left we can avoid overflow scrolling

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
const anchorRect = ref<DOMRect>()

const wrapperPosition = computed(() => {
  if (
    anchorRect.value === undefined ||
    wrapper.value === undefined ||
    !wrapper.value.el
  ) {
    return {}
  }

  const wrapRect = wrapper.value.el.getBoundingClientRect()
  const vw = Math.max(
    document.documentElement.clientWidth || 0,
    window.innerWidth || 0
  )
  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  )

  const distToBottom = vh - anchorRect.value.bottom
  const positionAbove = anchorRect.value.top > distToBottom

  console.log(vw, vh, anchorRect.value, wrapRect, distToBottom)

  return {
    // NOTE: this appears to work pretty well for top/bottom
    top: positionAbove ? "auto" : `100%`,
    bottom: positionAbove ? "100%" : `auto`,
    left: `${0}px`,
    transform: `translate3d(0, 0, 0)`,
  }
})

const setPositions = () => {
  if (trigger.value === undefined) return
  anchorRect.value = trigger.value.el.getBoundingClientRect()
}

onMounted(() => {
  setPositions()
  // TODO: throttle
  window.addEventListener("resize", setPositions)
  window.addEventListener("scroll", setPositions)
})

onUnmounted(() => {
  window.removeEventListener("resize", setPositions)
  window.removeEventListener("scroll", setPositions)
})

// TODO: maybe auto positioning - dynamic based on button location and closed overflow hidden container?
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
        <HeadlessPopoverPanel ref="wrapper" static>
          <!--positioning wrappers-->
          <div class="absolute z-10" :style="wrapperPosition">
            <div class="bg-gray-200">
              <slot :open="open" :close="close"></slot>
            </div>
          </div>
        </HeadlessPopoverPanel>
      </transition>
    </HeadlessPopover>
  </div>
</template>
