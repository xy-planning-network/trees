<template>
  <fieldset>
    <InputLabel class="block" :label="legend" type="legend"></InputLabel>
    <label
      class="inline-flex items-center"
      :class="{ 'cursor-not-allowed': $attrs.disabled }"
      :for="`${hasNameAttr ? name : uuid}-true`"
    >
      <input
        type="radio"
        class="w-4 h-4 border-gray-300 focus:ring-blue-500 text-xy-blue"
        :id="`${hasNameAttr ? name : uuid}-true`"
        :value="true"
        :checked="modelValue === true"
        v-bind="{
          ...$attrs,
          onChange: ($event) => {
            $emit('update:modelValue', $event.target.value === 'true');
          },
        }"
      />
      <span class="block ml-2 text-sm font-medium text-gray-700 leading-5"
        >Yes</span
      >
    </label>
    <label
      class="inline-flex items-center ml-6"
      :class="{ 'cursor-not-allowed': $attrs.disabled }"
      :for="`${hasNameAttr ? name : uuid}-false`"
    >
      <input
        type="radio"
        class="w-4 h-4 border-gray-300 focus:ring-blue-500 text-xy-blue"
        :id="`${hasNameAttr ? name : uuid}-false`"
        :value="false"
        :checked="modelValue === false"
        v-bind="{
          ...$attrs,
          onChange: ($event) => {
            $emit('update:modelValue', $event.target.value === 'true');
          },
        }"
      />
      <span class="block ml-2 text-sm font-medium text-gray-700 leading-5"
        >No</span
      >
    </label>
  </fieldset>
</template>

<script lang="ts">
import Uniques from "@/helpers/Uniques";
import { Options, Prop, Vue } from "vue-property-decorator";

@Options({ name: "YesOrNoRadio" })
export default class YesOrNoRadio extends Vue {
  @Prop({ type: Boolean, required: false }) modelValue?: boolean;
  @Prop({ type: String, required: false }) legend?: string;
  @Prop({ type: String, required: false, default: "" }) name?: string;

  uuid = Uniques.CreateIdAttribute();

  get hasNameAttr(): boolean {
    return typeof this.name === "string" && this.name !== "";
  }
}
</script>
