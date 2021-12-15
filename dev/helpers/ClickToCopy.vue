<template>
  <ClipboardCopyIcon
    class="w-5 h-5 inline cursor-pointer text-gray-600 hover:text-gray-900 active:text-gray-600"
    @click="copy"
  />
  <input
    ref="input"
    style="position: absolute; left: -999em"
    type="text"
    :value="value"
  />
  <transition
    enter-active-class="transform ease-out duration-200 transition origin-bottom"
    enter-from-class="scale-95 translate-y-0.5 opacity-0"
    enter-to-class="scale-100 translate-y-0 opacity-100"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <span v-show="copied" class="text-xs text-gray-600 inline"> Copied! </span>
  </transition>
</template>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator"
import { ClipboardCopyIcon } from "@heroicons/vue/outline"

@Options({ components: { ClipboardCopyIcon }, name: "ClickToCopy" })
export default class ClickToCopy extends Vue {
  @Prop({ type: String, required: true }) value!: string

  copied = false

  copy(): void {
    const input = this.$refs.input as HTMLInputElement
    input.select()
    input.setSelectionRange(0, 99999) /* For mobile devices */
    document.execCommand("copy")
    this.copied = true
    window.setTimeout(() => {
      this.copied = false
    }, 1500)
  }
}
</script>
