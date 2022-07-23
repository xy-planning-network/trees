<script lang="ts" setup>
import { usePopper, PopperPosition } from "@/composables/usePopper"
import {
  Popover as HeadlessPopover,
  PopoverButton as HeadlessPopoverButton,
  PopoverPanel as HeadlessPopoverPanel,
} from "@headlessui/vue"

const props = withDefaults(
  defineProps<{
    as?: string
    position?: PopperPosition
  }>(),
  {
    as: "div",
    position: "auto",
  }
)

const [trigger, container] = usePopper({
  placement: props.position,
  strategy: "fixed",
  modifiers: [{ name: "offset", options: { offset: [0, 5] } }],
})
</script>

<template>
  <HeadlessPopover v-slot="{ open, close }" :as="as" class="relative">
    <HeadlessPopoverButton ref="trigger">
      <slot name="button" :open="open" :close="close"></slot>
    </HeadlessPopoverButton>

    <HeadlessPopoverPanel class="relative z-10">
      <div ref="container">
        <slot :open="open" :close="close"></slot>
      </div>
    </HeadlessPopoverPanel>
  </HeadlessPopover>
</template>
