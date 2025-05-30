<script setup lang="ts">
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue"
import { XIcon } from "@heroicons/vue/outline"
import { watch } from "vue"

withDefaults(
  defineProps<{
    destructive?: boolean
    disabled?: boolean
    wide?: boolean
    submitText?: string
    title?: string
  }>(),
  {
    destructive: false,
    disabled: false,
    wide: false,
    submitText: "",
    title: "",
  }
)

const open = defineModel<boolean>({ required: true })

const emit = defineEmits<{
  (e: "close"): void
  (e: "submit"): void
}>()

const submit = () => {
  emit("submit")
}

watch(open, (isOpen) => {
  if (!isOpen) {
    emit("close")
  }
})
</script>
<template>
  <TransitionRoot as="template" :show="open">
    <Dialog
      as="div"
      static
      class="fixed z-30 inset-0 overflow-y-auto"
      :open="open"
      @close="open = false"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          />
        </TransitionChild>

        <!-- This element is to trick the browser into centering the modal contents. -->
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div
            class="inline-block align-bottom bg-white rounded-xy text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:rounded-xy-lg w-full"
            :class="wide ? 'sm:max-w-6xl' : 'sm:max-w-2xl'"
          >
            <div class="block absolute top-0 right-0 pt-4 pr-4 sm:pt-6 sm:pr-8">
              <button
                type="button"
                class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="open = false"
              >
                <span class="sr-only">Close</span>
                <XIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div class="bg-white px-4 pt-5 pb-4 sm:p-8 sm:pb-6">
              <div class="mt-3 sm:mt-0 sm:text-left">
                <DialogTitle
                  as="h3"
                  class="text-center text-lg leading-6 font-medium text-gray-900"
                  >{{ title }}</DialogTitle
                >
                <div class="mt-2">
                  <slot></slot>
                </div>
              </div>
            </div>
            <div
              v-if="submitText"
              class="bg-gray-50 px-4 py-3 sm:py-4 sm:px-8 sm:flex sm:flex-row-reverse"
            >
              <button
                type="button"
                class="xy-btn w-full sm:ml-3 sm:w-auto sm:text-sm"
                :class="[destructive ? 'xy-btn-red' : 'xy-btn']"
                :disabled="disabled"
                @click="submit()"
                v-text="submitText"
              ></button>
              <button
                type="button"
                class="xy-btn-neutral mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click="open = false"
              >
                Cancel
              </button>
            </div>
            <slot name="buttons"></slot>
          </div>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
