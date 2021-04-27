<template>
  <input
    type="text"
    :class="classes"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";

@Options({ name: "Input" })
export default class Input extends Vue {
  @Prop({ type: String, required: false }) design?: string;
  @Prop({ type: [String, Number], required: false }) modelValue?:
    | string
    | number;

  get classes(): string | undefined {
    const design = this.design ? this.design : "undefined";
    return ({
      undefined:
        "mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md",
      standard:
        "mt-1 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md",
      compressed:
        "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm",
      error:
        "mt-1 shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-red-300 rounded-md text-red-900 placeholder-red-300",
    } as any)[design];
  }
}
</script>
