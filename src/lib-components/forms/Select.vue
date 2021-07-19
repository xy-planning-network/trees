<template>
  <select
    :class="classes"
    :value="modelValue"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option value="" disabled v-if="placeholder" v-text="placeholder"></option>
    <option
      v-for="option in options"
      :value="option.value"
      v-text="option.label"
      :key="option.value"
    ></option>
  </select>
</template>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";

@Options({ name: "Select" })
export default class Select extends Vue {
  @Prop({ type: String, required: false }) design?: string;
  @Prop({ type: Array, required: true }) options!: Array<{
    label: string;
    value: string;
  }>;
  @Prop({ type: String, required: false, default: "Select an option" })
  placeholder?: string;
  @Prop({ type: String, required: true }) modelValue!: string | undefined;

  get classes(): string {
    const design = this.design ? this.design : "undefined";
    return ({
      undefined:
        "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
      standard:
        "mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
      compressed:
        "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm",
    } as any)[design];
  }
}
</script>
