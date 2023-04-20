<script setup lang="ts">
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue"
import { XIcon } from "@heroicons/vue/outline"
import { ref } from "vue"

const props = defineProps<{
  header: string
  description: string
  modelValue: boolean
}>()

const open = ref(props.modelValue)

const emit = defineEmits<{
  (e: "close", val: boolean): void
  (e: "update:modelValue", val: boolean): void
}>()

const close = () => {
  open.value = false
  emit("close", open.value)
  emit("update:modelValue", open.value)
}
</script>
<template>
  <TransitionRoot as="template" :show="modelValue">
    <Dialog
      as="div"
      static
      class="fixed inset-0 z-20 overflow-hidden bg-black bg-opacity-50"
      :open="modelValue"
      @close="close()"
    >
      <div class="absolute inset-0 overflow-hidden">
        <DialogOverlay class="absolute inset-0" />

        <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <TransitionChild
            as="template"
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enter-from="translate-x-full"
            enter-to="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leave-from="translate-x-0"
            leave-to="translate-x-full"
          >
            <div class="w-screen max-w-md">
              <div
                class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll"
              >
                <div class="py-6 px-4 bg-blue-700 sm:px-6">
                  <div class="flex items-center justify-between">
                    <DialogTitle as="h3" class="text-white">
                      {{ header }}
                    </DialogTitle>
                    <div class="ml-3 h-7 flex items-center">
                      <button
                        class="bg-blue-700 rounded-md text-blue-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                        @click="close()"
                      >
                        <span class="sr-only">Close panel</span>
                        <XIcon class="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                  <div class="mt-1">
                    <p class="text-blue-300" v-text="description"></p>
                  </div>
                </div>
                <div class="relative flex-1 py-6 px-4 sm:px-6">
                  <slot></slot>
                </div>

                <slot name="footer"></slot>
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
