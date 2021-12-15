<template>
  <div>
    <nav class="flex items-center justify-center space-x-8">
      <p class="font-medium">Step {{ step }} of {{ total }}</p>
      <ul class="flex items-center space-x-5">
        <li v-for="index in total" :key="index">
          <span
            class="block w-2.5 h-2.5 bg-xy-green rounded-full hover:bg-green-900 focus:bg-green-900"
            v-if="step > index"
          ></span>

          <div
            class="relative flex items-center justify-center"
            v-else-if="step === index"
          >
            <span class="absolute w-5 h-5 p-px flex">
              <span class="w-full h-full rounded-full bg-green-100"></span>
            </span>
            <span
              class="relative block w-2.5 h-2.5 bg-xy-green rounded-full"
            ></span>
          </div>

          <span
            href="#"
            class="block w-2.5 h-2.5 bg-gray-200 rounded-full hover:bg-gray-400 focus:bg-gray-400"
            v-else
          ></span>
        </li>
      </ul>
    </nav>

    <div class="flex flex-shrink-0" v-if="!hideActions">
      <span class="inline-flex rounded-md shadow-sm" v-if="!hidePrevious">
        <button type="button" class="xy-btn-white" @click="previous">
          Back
        </button>
      </span>
      <span class="ml-3 inline-flex rounded-md shadow-sm">
        <button
          type="button"
          class="xy-btn"
          @click="next"
          v-text="nextText ? nextText : 'Next'"
        ></button>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Emit, Prop, Vue } from "vue-property-decorator"

@Options({ name: "Steps" })
export default class Steps extends Vue {
  @Prop({ type: Boolean, required: false }) hideActions?: boolean
  @Prop({ type: Boolean, required: false }) hidePrevious?: boolean
  @Prop({ type: String, required: false }) nextText?: string
  @Prop({ type: Number, required: true }) step!: number
  @Prop({ type: Number, required: true }) total!: number

  @Emit()
  next(): void {
    return
  }

  @Emit()
  previous(): void {
    return
  }
}
</script>
