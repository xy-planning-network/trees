<template>
  <div
    class="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
  >
    <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
      <div
        class="-ml-4 -mt-4 flex justify-between items-center flex-wrap sm:flex-nowrap"
      >
        <div class="ml-4 mt-4">
          <h3
            class="text-lg leading-6 font-medium text-gray-900"
            v-text="title"
          ></h3>
          <p class="mt-1 text-sm text-gray-500">
            <slot name="description"></slot>
          </p>
        </div>
        <div class="ml-4 mt-4 flex-shrink-0">
          <span v-if="cssComponent" class="xy-badge-yellow">
            CSS Class Component
          </span>
          <span v-else class="xy-badge-blue"> Vue Component </span>
        </div>
      </div>
    </div>
    <div class="px-4 py-5 sm:p-6 space-y-6">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";
import { ClipboardCopyIcon } from "@heroicons/vue/outline";

@Options({ components: { ClipboardCopyIcon }, name: "ComponentLayout" })
export default class ComponentLayout extends Vue {
  @Prop({ type: Boolean, required: false }) cssComponent?: boolean;
  @Prop({ type: String, required: true }) title!: string;

  copied = false;

  copy(): void {
    const input = this.$refs.input as HTMLInputElement;
    input.select();
    input.setSelectionRange(0, 99999); /* For mobile devices */
    document.execCommand("copy");
    this.copied = true;
    window.setTimeout(() => {
      this.copied = false;
    }, 1500);
  }
}
</script>
