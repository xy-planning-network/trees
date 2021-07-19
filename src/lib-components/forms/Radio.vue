<template>
  <fieldset class="mt-1 space-y-2">
    <div v-for="option in options" :key="option.value">
      <label
        class="inline-flex items-center"
        :class="{ 'cursor-not-allowed': disabled }"
      >
        <input
          type="radio"
          class="w-4 h-4 border-gray-300 focus:ring-blue-500 text-xy-blue"
          :disabled="disabled"
          :name="option.label"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="$emit('update:modelValue', $event.target.value)"
          :required="required"
        />
        <span class="block ml-2 text-sm font-medium text-gray-700 leading-5">
          {{ option.label }}
        </span>
      </label>
    </div>
  </fieldset>
</template>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";

@Options({ name: "Radio" })
export default class Radio extends Vue {
  @Prop({ type: Boolean, required: false }) disabled?: boolean;
  @Prop({ type: Array, required: true }) options!: Array<{
    label: string;
    value: string;
  }>;
  @Prop({ type: Boolean, required: false }) required?: boolean;
  @Prop({ type: String, required: false }) modelValue?: string;
}
</script>
