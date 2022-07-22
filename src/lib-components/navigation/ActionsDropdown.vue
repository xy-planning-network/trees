<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import { DotsVerticalIcon } from "@heroicons/vue/solid"
import { computed } from "vue"
import * as TableTypes from "@/composables/table"
import User from "@/composables/user"
import { usePopper, Placement } from "@/composables/usePopper"

const props = withDefaults(
  defineProps<{
    currentUser: User
    items: TableTypes.MenuItem[]
    placement?: Placement
    propsData: any
  }>(),
  {
    placement: "bottom-end",
  }
)

const [trigger, container] = usePopper({
  placement: props.placement,
  strategy: "fixed",
  modifiers: [{ name: "offset", options: { offset: [0, 5] } }],
})

const menuItems = computed(() => {
  return props.items.filter((item) => {
    if (item?.show === undefined) {
      return true
    }
    return item.show(props.propsData, props.currentUser)
  })
})

const emitEvent = (event: string): void => {
  window.VueBus.emit(event, props.propsData)
}
</script>
<template>
  <Menu as="div" class="relative flex justify-end items-center">
    <MenuButton
      ref="trigger"
      class="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-700 rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="menuItems.length === 0"
    >
      <span class="sr-only">Open options</span>
      <DotsVerticalIcon class="w-5 h-5" aria-hidden="true" />
    </MenuButton>
    <div ref="container" class="w-48 z-10">
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems
          class="rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
        >
          <div class="py-1">
            <template v-for="(item, idx) in items" :key="idx">
              <MenuItem as="div" v-slot="{ active }">
                <button
                  type="submit"
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block w-full text-left px-4 py-2 text-sm font-semibold',
                  ]"
                  v-text="item.label"
                  @click="emitEvent(item.event)"
                ></button>
              </MenuItem>
            </template>
          </div>
        </MenuItems>
      </transition>
    </div>
  </Menu>
</template>
