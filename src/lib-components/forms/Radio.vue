<template>
  <fieldset class="mt-1 space-y-2">
    <InputLabel class="block" :label="legend" tag="legend"></InputLabel>
    <div v-for="(option, index) in options" :key="option.value">
      <label
        class="inline-flex items-center"
        :class="{ 'cursor-not-allowed': $attrs.disabled }"
        :for="`${uuid}-${index}`"
      >
        <input
          :checked="modelValue === option.value"
          class="w-4 h-4 border-gray-300 focus:ring-blue-500 text-xy-blue"
          :id="`${uuid}-${index}`"
          type="radio"
          :value="option.value"
          v-bind="{
            ...$attrs,
            onChange: ($event) => {
              $emit('update:modelValue', $event.target.value);
            },
          }"
        />
        <span class="block ml-2 text-sm font-medium leading-5">
          {{ option.label }}
        </span>
      </label>
    </div>
  </fieldset>
</template>

<script lang="ts">
import Uniques from "@/helpers/Uniques";
import { Options, Prop, Vue } from "vue-property-decorator";
import InputLabel from "./InputLabel.vue";

@Options({ name: "Radio", components: { InputLabel } })
export default class Radio extends Vue {
  @Prop({ type: Array, required: true }) options!: Array<{
    label: string;
    value: string;
  }>;
  @Prop({ type: String, required: false }) legend?: string;
  @Prop({ type: String, required: false }) modelValue?: string;

  uuid = (this.$attrs.id as string) || Uniques.CreateIdAttribute();
}
</script>
