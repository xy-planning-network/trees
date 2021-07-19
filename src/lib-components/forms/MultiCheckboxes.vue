<template>
  <fieldset>
    <div class="mt-4" v-for="option in options" :key="option.value">
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            type="checkbox"
            class="focus:ring-blue-500 h-4 w-4 text-xy-blue border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            :value="option.value"
            v-model="internalModel"
          />
        </div>
        <div class="ml-3 text-sm leading-5">
          <label class="text-gray-500" v-text="option.label"></label>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script lang="ts">
import { Options, Prop, Vue, Watch } from "vue-property-decorator";

@Options({ name: "MultiCheckboxes" })
export default class MultiCheckboxes extends Vue {
  @Prop({ type: Array, required: true }) options!: Array<{
    label: string;
    value: string;
  }>;
  @Prop({ type: Array, required: true }) modelValue!: string[];

  internalModel = this.modelValue;

  @Watch("internalModel")
  onInternalModelChanged(val: string[]): void {
    this.$emit("update:modelValue", val);
  }
}
</script>
