<template>
  <div class="relative flex items-start">
    <div class="h-5 flex items-center">
      <input
        type="checkbox"
        class="focus:ring-blue-500 h-4 w-4 text-xy-blue border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        :checked="modelValue"
        :disabled="disabled"
        @change="$emit('update:modelValue', $event.target.checked)"
        :required="required"
      />
    </div>
    <div class="ml-3 text-sm leading-5">
      <label
        class="text-gray-500"
        :class="{ 'font-medium': emphasis }"
        v-text="label"
      ></label>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";

@Options({ name: "Checkbox" })
export default class Checkbox extends Vue {
  @Prop({ type: Boolean, required: false }) disabled?: boolean;
  @Prop({ type: Boolean, required: false }) emphasis?: boolean;
  @Prop({ type: String, required: false }) label?: string;
  @Prop({ type: Boolean, required: false }) required?: boolean;
  @Prop({ type: Boolean, required: true }) modelValue!: boolean;
}
</script>
