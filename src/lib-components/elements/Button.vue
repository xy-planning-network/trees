<template>
  <button type="button" :class="classes">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Prop, Vue } from "vue-property-decorator";

export default class Button extends Vue {
  @Prop({ type: String, required: false }) design?: string;

  get classes(): string {
    const design = this.design ? this.design : "undefined";
    return ({
      undefined:
        "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
      primary:
        "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
      red:
        "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-red-700 bg-red-100 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed",
      secondary:
        "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed",
      white:
        "inline-flex items-center px-4 py-2 border border-xy-blue shadow-md text-sm font-medium rounded-md text-xy-blue bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
      green:
        "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-white bg-xy-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed",
    } as any)[design];
  }
}
</script>
