<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import { DotsVerticalIcon } from "@heroicons/vue/solid"
import { computed, isRef } from "vue"
import type { ActionMenuItem } from "@/composables/nav"

const props = defineProps<{
  actions: ActionMenuItem[]
}>()

const menuItems = computed(() => {
  return props.actions.filter((action) => {
    if (action.show === undefined) {
      return true
    }

    if (isRef<boolean>(action.show)) {
      return action.show.value
    }

    if (typeof action.show === "boolean") {
      return action.show
    }

    return action.show()
  })
})
</script>
<template>
  <Menu as="div" class="relative flex justify-end items-center">
    <MenuButton
      class="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-700 rounded-full hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="menuItems.length === 0"
    >
      <span class="sr-only">Open options</span>
      <DotsVerticalIcon class="w-5 h-5" aria-hidden="true" />
    </MenuButton>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="z-10 mx-3 origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
      >
        <div class="py-1">
          <template v-for="(action, idx) in menuItems" :key="idx">
            <MenuItem v-slot="{ active }: { active: boolean }" as="div">
              <button
                type="submit"
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'block w-full text-left px-4 py-2 text-sm font-semibold',
                ]"
                @click="action.event"
              >
                <span class="relative inline-flex items-center gap-x-1.5">
                  <component
                    :is="action.icon"
                    v-if="action.icon"
                    class="-ml-0.5 h-4 w-4 text-gray-400"
                    aria-hidden="true"
                  />
                  {{ action.label }}
                </span>
              </button>
            </MenuItem>
          </template>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
