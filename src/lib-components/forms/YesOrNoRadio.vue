<template>
  <fieldset>
    <label
      class="inline-flex items-center"
      :class="{ 'cursor-not-allowed': disabled }"
    >
      <input
        type="radio"
        class="w-4 h-4 border-gray-300 focus:ring-blue-500 text-xy-blue"
        :disabled="disabled"
        :value="true"
        :checked="modelValue === true"
        @change="$emit('update:modelValue', $event.target.value === 'true')"
        :required="required"
      />
      <span class="block ml-2 text-sm font-medium text-gray-700 leading-5"
        >Yes</span
      >
    </label>
    <label
      class="inline-flex items-center ml-6"
      :class="{ 'cursor-not-allowed': disabled }"
    >
      <input
        type="radio"
        class="w-4 h-4 border-gray-300 focus:ring-blue-500 text-xy-blue"
        :disabled="disabled"
        :value="false"
        :checked="modelValue === false"
        @change="$emit('update:modelValue', $event.target.value === 'true')"
        :required="required"
      />
      <span class="block ml-2 text-sm font-medium text-gray-700 leading-5"
        >No</span
      >
    </label>
  </fieldset>
</template>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";

@Options({ name: "YesOrNoRadio" })
export default class YesOrNoRadio extends Vue {
  @Prop({ type: Boolean, required: false }) disabled?: boolean;
  @Prop({ type: Boolean, required: false }) required?: boolean;
  @Prop({ type: Boolean, required: false }) modelValue?: boolean;
}
</script>
