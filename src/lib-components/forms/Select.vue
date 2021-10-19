<template>
  <InputLabel :id="`${uuid}-label`" :for="uuid" :label="label"></InputLabel>
  <select
    :aria-labelledby="label ? `${uuid}-label` : undefined"
    :aria-describedby="help ? `${uuid}-help` : undefined"
    :class="classes"
    :id="uuid"
    :value="modelValue"
    v-bind="{
      ...$attrs,
      onChange: ($event) => {
        $emit('update:modelValue', $event.target.value);
      },
    }"
  >
    <option
      value=""
      disabled
      selected
      v-if="placeholder"
      :placeholder="placeholder"
    >
      {{ placeholder }}
    </option>
    <option
      v-for="option in options"
      :value="option.value"
      v-text="option.label"
      :key="option.value"
    ></option>
  </select>
  <InputHelp :id="`${uuid}-help`" :text="help"></InputHelp>
</template>

<script lang="ts">
import Uniques from "@/helpers/Uniques";
import { Options, Prop, Vue } from "vue-property-decorator";
import InputLabel from "./InputLabel.vue";
import InputHelp from "./InputHelp.vue";

@Options({ name: "Select", components: { InputLabel, InputHelp } })
export default class Select extends Vue {
  @Prop({ type: String, required: false }) design?: string;
  @Prop({ type: String, required: false }) label?: string;
  @Prop({ type: String, required: false }) help?: string;
  @Prop({ type: Array, required: true }) options!: Array<{
    label: string;
    value: string;
  }>;
  @Prop({ type: String, required: false, default: "Select an option" })
  placeholder?: string;
  @Prop({ type: String, required: true }) modelValue!: string | undefined;

  uuid = (this.$attrs.id as string) || Uniques.CreateIdAttribute();

  get classes(): string {
    const design = this.design ? this.design : "undefined";
    return ({
      undefined:
        "mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
      standard:
        "mt-1 block w-full border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm",
      compressed:
        "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm",
    } as any)[design];
  }
}
</script>
