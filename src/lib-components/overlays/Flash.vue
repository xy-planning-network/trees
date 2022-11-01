<script setup lang="ts">
import {
  FlashType,
  useAppFlashes,
  loadWindowFlashes,
} from "@/composables/useFlashes"
import { onMounted } from "vue"

const { flasher, flashes } = useAppFlashes()

const getFlashClass = (type: FlashType) => {
  switch (type) {
    case "warning":
      return "border-orange-500"
    case "error":
      return "border-red-500"
    case "info":
      return "border-blue-500"
    case "success":
      return "border-green-500"
  }
}
onMounted(() => {
  // NOTE: (spk) there's a strong argument that this component should accept flashes: Flash[] as a prop
  // and a parent container like StackedLayout or SidebarLayout should handle initiating useFlashes
  // and be singularly responsible for loading flashes from the window.
  loadWindowFlashes(flasher)
})
</script>
<template>
  <div
    class="fixed inset-0 flex flex-col items-end justify-end px-4 py-6 pointer-events-none sm:p-6 z-40"
  >
    <transition-group
      tag="div"
      class="max-w-sm space-y-2 w-full"
      enter-active-class="ease-out duration-300"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-for="[id, flash] in flashes"
        :key="flash.message"
        class="bg-white shadow-lg rounded-lg pointer-events-auto border-t-4 transform"
        :class="[getFlashClass(flash.type)]"
      >
        <div
          class="rounded-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
        >
          <div class="p-4">
            <div class="flex items-center">
              <div class="w-0 flex-1 flex justify-between">
                <p
                  class="w-0 flex-1 text-sm leading-5 font-medium text-gray-900"
                  v-html="flash.message"
                ></p>
              </div>
              <div class="ml-4 shrink-0 flex">
                <button
                  @click="flasher.remove(id)"
                  class="inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
                >
                  <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<style>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
