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
</script>
<script lang="ts" setup>
import {
  Popover as HeadlessPopover,
  PopoverButton as HeadlessPopoverButton,
  PopoverPanel as HeadlessPopoverPanel,
} from "@headlessui/vue"
import { InformationCircleIcon } from "@heroicons/vue/outline"
import { computed, RenderFunction } from "vue"
import PopoverContent from "./PopoverContent.vue"

const props = withDefaults(
  defineProps<{
    text?: string
    buttonText?: string
    buttonIcon?: RenderFunction
    position?: PopoverPosition
  }>(),
  {
    text: "",
    buttonText: "",
    buttonIcon: InformationCircleIcon,
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

// TODO: maybe auto positioning - dynamic based on button location and closed overflow hidden container?
</script>

<template>
  <div class="flex">
    <HeadlessPopover v-slot="{ open, close }" class="relative leading-none">
      <HeadlessPopoverButton>
        <slot name="button" :open="open" :close="close">
          <span class="inline-flex items-center justify-center"
            ><span v-if="buttonText" class="mr-1">{{ buttonText }}</span>
            <component :is="buttonIcon" class="w-5 h-5" />
          </span>
        </slot>
      </HeadlessPopoverButton>

      <transition
        enter-active-class="transition-opacity transition-faster ease-out-quad"
        leave-active-class="transition-opacity transition-faster ease-in-quad"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <!--NOTE: use prop "static" for dev work to keep the tooptip visible during-->
        <HeadlessPopoverPanel>
          <!--positioning wrappers-->
          <div
            class="absolute z-10 transform w-screen flex"
            :class="positionClasses.wrapper"
          >
            <div :class="positionClasses.content">
              <slot :open="open" :close="close">
                <PopoverContent>
                  {{ text }}
                </PopoverContent>
              </slot>
            </div>
          </div>
        </HeadlessPopoverPanel>
      </transition>
    </HeadlessPopover>
  </div>
</template>

<style></style>
