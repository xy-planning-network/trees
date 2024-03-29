<script lang="ts" setup>
import {
  Popover as HeadlessPopover,
  PopoverButton as HeadlessPopoverButton,
  PopoverPanel as HeadlessPopoverPanel,
} from "@headlessui/vue"
import { computed, ref } from "vue"
import {
  useFloating,
  offset,
  autoPlacement,
  autoUpdate,
  shift,
} from "@floating-ui/vue"
import type { Placement } from "@floating-ui/vue"

const props = withDefaults(
  defineProps<{
    as?: string
    position?: Placement | "auto"
  }>(),
  {
    as: "div",
    position: "auto",
  }
)

const trigger = ref<HTMLElement | null>(null)
const wrapper = ref<HTMLElement | null>(null)
const middleware = computed(() => {
  const middleware = [offset(5), shift()]
  if (props.position === "auto") {
    middleware.push(autoPlacement())
  }

  return middleware
})

/**
 * floating-ui's placement property does not support a direct "auto"
 * mode. Passing undefined is expected when auto position is used.
 */
const placement = computed(() => {
  if (props.position === "auto") {
    return undefined
  }

  return props.position
})

const { floatingStyles } = useFloating(trigger, wrapper, {
  middleware: middleware,
  placement: placement,
  strategy: "fixed",
  whileElementsMounted: autoUpdate,
})
</script>

<template>
  <HeadlessPopover v-slot="{ open, close }" :as="as" class="relative">
    <HeadlessPopoverButton ref="trigger">
      <slot name="button" :open="open" :close="close"></slot>
    </HeadlessPopoverButton>

    <div ref="wrapper" class="z-[5]" :style="floatingStyles">
      <HeadlessPopoverPanel>
        <slot :open="open" :close="close"></slot>
      </HeadlessPopoverPanel>
    </div>
  </HeadlessPopover>
</template>
