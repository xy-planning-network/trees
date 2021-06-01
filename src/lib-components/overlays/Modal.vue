<template>
  <TransitionRoot as="template" :show="modelValue">
    <Dialog
      as="div"
      static
      class="fixed z-10 inset-0 overflow-y-auto"
      @close="updateModelValue(false)"
      :open="modelValue"
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
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full"
          >
            <div class="block absolute top-0 right-0 pt-4 pr-4">
              <button
                type="button"
                class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                @click="updateModelValue(false)"
              >
                <span class="sr-only">Close</span>
                <XIcon class="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="mt-3 sm:mt-0 sm:text-left">
                <DialogTitle
                  as="h3"
                  class="text-center text-lg leading-6 font-medium text-gray-900"
                  v-text="title"
                ></DialogTitle>
                <div class="mt-2">
                  <slot></slot>
                </div>
              </div>
            </div>
            <div
              class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
              v-if="submitText"
            >
              <button
                type="button"
                class="xy-btn w-full sm:ml-3 sm:w-auto sm:text-sm"
                @click="submit()"
                v-text="submitText"
                :class="[destructive ? 'xy-btn-red' : 'xy-btn']"
                :disabled="disabled"
              ></button>
              <button
                type="button"
                class="xy-btn-white mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                @click="updateModelValue(false)"
                ref="cancelButtonRef"
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

<script lang="ts">
import { Emit, Options, Prop, Vue } from "vue-property-decorator";
import {
  Dialog,
  DialogOverlay,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { ExclamationIcon, XIcon } from "@heroicons/vue/outline";

@Options({
  components: {
    Dialog,
    DialogOverlay,
    DialogTitle,
    TransitionChild,
    TransitionRoot,
    ExclamationIcon,
    XIcon,
  },
  name: "Modal",
})
export default class Modal extends Vue {
  @Prop({ type: Boolean, required: false }) destructive?: boolean;
  @Prop({ type: Boolean, required: false }) disabled?: boolean;
  @Prop({ type: Boolean, required: true }) modelValue!: boolean;
  @Prop({ type: String, required: false }) submitText?: string;
  @Prop({ type: String, required: false }) title?: string;

  @Emit()
  submit(): void {
    return;
  }

  @Emit("update:modelValue")
  updateModelValue(value: boolean): boolean {
    return value;
  }
}
</script>