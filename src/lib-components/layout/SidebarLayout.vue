<script setup lang="ts">
import Flash from "../overlays/Flash.vue"
import Spinner from "../overlays/Spinner.vue"
import {
  Dialog,
  DialogOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue"
import { MenuAlt2Icon, XIcon } from "@heroicons/vue/outline"
import { CogIcon } from "@heroicons/vue/solid"
import * as NavTypes from "@/composables/nav"
import { ref } from "vue"

const props = withDefaults(
  defineProps<{
    activeUrl?: string
    iconUrl: string
    navigation: NavTypes.Item[]
    userNavigation: NavTypes.Item[]
  }>(),
  {
    activeUrl: "",
  }
)

const sidebarOpen = ref<boolean>(false)

const isActive = (url: string): boolean => {
  return props.activeUrl === url
}
</script>
<template>
  <div class="h-screen flex overflow-hidden bg-gray-50">
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog
        as="div"
        static
        class="fixed inset-0 flex z-10 lg:hidden"
        :open="sidebarOpen"
        @close="sidebarOpen = false"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </TransitionChild>
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <div
            class="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white"
          >
            <TransitionChild
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in-out duration-300"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  class="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  @click="sidebarOpen = false"
                >
                  <span class="sr-only">Close sidebar</span>
                  <XIcon class="h-6 w-6 text-white" aria-hidden="true" />
                </button>
              </div>
            </TransitionChild>
            <div class="shrink-0 flex justify-center px-4">
              <img class="w-auto h-12" :src="iconUrl" alt="Logo" />
            </div>
            <div class="mt-5 flex flex-col flex-1 h-0 overflow-y-auto">
              <div class="flex-1 px-2">
                <slot name="sidebar-nav">
                  <nav class="space-y-1">
                    <a
                      v-for="item in navigation"
                      :key="item.name"
                      :href="item.url"
                      :class="[
                        isActive(item.url)
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                        'group flex items-center px-2 py-2 text-base font-semibold rounded-md',
                      ]"
                      :target="item.openInTab ? '_blank' : '_self'"
                    >
                      <component
                        :is="item.icon"
                        :class="[
                          isActive(item.url)
                            ? 'text-gray-600'
                            : 'text-gray-500 group-hover:text-gray-600',
                          'mr-4 h-6 w-6',
                        ]"
                        aria-hidden="true"
                      />
                      {{ item.name }}
                    </a>
                  </nav>
                </slot>
              </div>
              <div v-if="$slots['sidebar-bottom']" class="mt-auto">
                <div class="mt-6 px-2">
                  <slot name="sidebar-bottom" />
                </div>
              </div>
            </div>
          </div>
        </TransitionChild>
        <div class="shrink-0 w-14" aria-hidden="true">
          <!-- Dummy element to force sidebar to shrink to fit close icon -->
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden lg:flex lg:shrink-0">
      <div class="flex flex-col w-64">
        <!-- Sidebar component, swap this element with another sidebar if you like -->
        <div
          class="flex flex-col grow border-r border-gray-200 pt-5 pb-4 bg-white overflow-y-auto"
        >
          <div class="flex justify-center shrink-0 px-4">
            <img class="w-auto h-12" :src="iconUrl" alt="Logo" />
          </div>
          <div class="mt-5 grow flex flex-col">
            <div class="flex-1 px-2 bg-white">
              <slot name="sidebar-nav">
                <nav class="space-y-1">
                  <a
                    v-for="item in navigation"
                    :key="item.name"
                    :href="item.url"
                    :class="[
                      isActive(item.url)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-semibold rounded-md',
                    ]"
                    :target="item.openInTab ? '_blank' : '_self'"
                  >
                    <component
                      :is="item.icon"
                      :class="[
                        isActive(item.url)
                          ? 'text-gray-600'
                          : 'text-gray-400 group-hover:text-gray-600',
                        'mr-3 h-6 w-6',
                      ]"
                      aria-hidden="true"
                    />
                    {{ item.name }}
                  </a>
                </nav>
              </slot>
            </div>

            <div v-if="$slots['sidebar-bottom']" class="mt-atuo">
              <div class="mt-6 px-2">
                <slot name="sidebar-bottom" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <div class="relative z-10 shrink-0 flex h-16 bg-xy-blue shadow">
        <button
          class="px-4 border-r border-gray-200 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
          @click="sidebarOpen = true"
        >
          <span class="sr-only">Open sidebar</span>
          <MenuAlt2Icon class="h-6 w-6" aria-hidden="true" />
        </button>
        <div class="flex-1 px-4 flex justify-between">
          <div class="flex-1 flex">
            <h1
              class="flex items-center text-base leading-snug sm:text-2xl text-white"
            >
              <slot name="header"></slot>
            </h1>
          </div>
          <div class="ml-4 flex items-center lg:ml-6">
            <!-- Profile dropdown -->
            <Menu as="div" class="ml-3 relative">
              <div>
                <MenuButton
                  class="max-w-xs flex items-center text-sm text-white rounded-full hover:bg-blue-900 hover:text-gray-50 focus:outline-none focus:ring focus:text-white"
                >
                  <span class="sr-only">Open user menu</span>
                  <CogIcon class="h-8 w-8" fill="currentColor" />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <a
                      :href="item.url"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700 font-semibold',
                      ]"
                      >{{ item.name }}</a
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
        </div>
      </div>

      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <div class="mx-auto">
          <!-- Replace with your content -->
          <slot></slot>
          <!-- /End replace -->
        </div>
      </main>
    </div>
  </div>

  <Flash />
  <Spinner />
</template>
