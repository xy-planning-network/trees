<script setup lang="ts">
import { Portal } from "@headlessui/vue"
import XYSpinner from "../indicators/XYSpinner.vue"
import { useAppSpinnerDisplay } from "@/composables/useSpinner"

const { idx, loading, maxIdx, messages, msg, showMsg } = useAppSpinnerDisplay()

const fadeIn = (): void => {
  idx.value++
  if (idx.value > maxIdx.value) {
    idx.value = 0
  }
  if (messages.value) {
    msg.value = messages.value[idx.value]
  }
  showMsg.value = true
}

const fadeOut = (): void => {
  window.setTimeout(() => {
    showMsg.value = false
  }, 2500)
}
</script>
<template>
  <Portal>
    <div
      v-if="loading"
      class="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-full cursor-not-allowed z-40 bg-gray-50 bg-opacity-60"
    >
      <XYSpinner class="w-32 h-32" />
      <div v-show="messages" class="mt-2">
        <transition
          appear
          enter-active-class="ease-out duration-1000"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="ease-in duration-500"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          @after-enter="fadeOut"
          @after-leave="fadeIn"
        >
          <div
            v-show="showMsg"
            class="container font-medium text-lg leading-snug text-center transition-opacity"
          >
            {{ msg }}
          </div>
        </transition>
      </div>
    </div>
  </Portal>
</template>
