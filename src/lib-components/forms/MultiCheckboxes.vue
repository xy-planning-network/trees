<template>
  <fieldset>
    <InputLabel class="block mb-0" :label="legend" tag="legend"></InputLabel>
    <div class="mt-4" v-for="(option, index) in options" :key="option.value">
      <div class="flex items-start">
        <div class="flex items-center h-5">
          <input
            type="checkbox"
            class="focus:ring-blue-500 h-4 w-4 text-xy-blue border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            :id="`${uuid}-${index}`"
            :value="option.value"
            v-model="model"
            v-bind="$attrs"
          />
        </div>
        <div class="ml-3 text-sm font-semibold leading-snug text-gray-900">
          <label :for="`${uuid}-${index}`" v-text="option.label"></label>
        </div>
      </div>
    </div>
  </fieldset>
</template>

<script lang="ts">
import Uniques from "@/helpers/Uniques";
import { Options, Prop, Vue, Watch } from "vue-property-decorator";
import InputLabel from "./InputLabel.vue";

@Options({ name: "MultiCheckboxes", components: { InputLabel } })
export default class MultiCheckboxes extends Vue {
  @Prop({ type: Array, required: true }) options!: Array<{
    label: string;
    value: string;
  }>;
  @Prop({ type: String, required: false }) legend?: string;
  @Prop({ type: Array, required: true }) modelValue!: string[];

  model: string[] = [];

  uuid = (this.$attrs.id as string) || Uniques.CreateIdAttribute();

  @Watch("model")
  onModelChanged(val: string[]): void {
    this.$emit("update:modelValue", val);
  }

  mounted() {
    this.model = this.modelValue;
  }
}
</script>
