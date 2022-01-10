<script setup lang="ts">
import { Flash } from "@/composables/overlay"
import { onMounted, ref } from "vue"

// TODO: spk this might benefit from the composition api to avoid race conditions where a flash is requested before the component is mounted.

const flashes = ref<Flash[]>([])
const flashTypeBorderClass = {
  warning: "border-orange-500",
  error: "border-red-500",
  info: "border-blue-500",
  success: "border-green-500",
}

const getFlashClass = (flash: Flash): string => {
  const availableTypes = Object.keys(flashTypeBorderClass)
  // default the flash type to "info" if no flash type or an unsupported flash.type is found
  const type =
    flash?.type && availableTypes.includes(flash.type)
      ? (flash.type as "warning" | "error" | "info" | "success")
      : "info"
  return flashTypeBorderClass[type]
}

const remove = (flash: Flash): void => {
  let index = 0
  for (const f of flashes.value) {
    if (flash.message === f.message) {
      flashes.value.splice(index, 1)
      return
    }
    index++
  }
}
const renderFlash = (flash: Flash): void => {
  flashes.value.push(flash)
  // Super simple flash implementation. This could get "smarter" by adding an
  // id to the flash object, and then searching for the specific flash in the
  // array and splicing, instead of simply doing a pop().
  setTimeout(
    (flashes: Flash[]) => {
      flashes.pop()
    },
    10000,
    flashes.value
  )
}

const renderGenericError = (email: string): void => {
  renderFlash({
    type: "error",
    message:
      "Whoops! Something went wrong, please reach out to " +
      `<a class="underline text-xy-blue" href="mailto:${email}">${email}</a>` +
      " if the issue persists.",
  })
}

onMounted(() => {
  window.VueBus.on("Flash-show-message", (flash) => {
    renderFlash(flash)
  })

  window.VueBus.on("Flash-show-generic-error", (email) => {
    renderGenericError(email)
  })

  if (window.Flashes) {
    for (const flash of window.Flashes) {
      if (typeof flash.type === "undefined") {
        const values: string[] = flash.message.split(": ")
        renderFlash({ type: values[0], message: values[1] })
        return
      }
      renderFlash({ type: flash.type, message: flash.message })
    }
  }
})
</script>
<template>
  <div
    class="fixed inset-0 flex flex-col items-end justify-end px-4 py-6 pointer-events-none sm:p-6 z-40"
  >
    <transition-group
      tag="div"
      class="max-w-sm w-full"
      enter-active-class="ease-out duration-300"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-for="(flash, idx) in flashes"
        :key="flash.message"
        class="bg-white shadow-lg rounded-lg pointer-events-auto border-t-4 transform"
        :class="[{ 'mt-2': idx > 0 }, getFlashClass(flash)]"
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
              <div class="ml-4 flex-shrink-0 flex">
                <button
                  @click="remove(flash)"
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
