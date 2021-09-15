<template>
  <InputLabel :id="`${uuid}-label`" :for="uuid" :label="label"></InputLabel>
  <input
    class="my-2 shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
    :aria-labelledby="label ? `${uuid}-label` : undefined"
    :aria-describedby="help ? `${uuid}-help` : undefined"
    :id="uuid"
    :placeholder="label"
    :type="type"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    v-bind="$attrs"
  />
  <InputHelp :id="`${uuid}-help`" :text="help"></InputHelp>
</template>

<script lang="ts">
import Uniques from "@/helpers/Uniques";
import { Options, Prop, Vue } from "vue-property-decorator";

@Options({ name: "BaseText" })
export default class InputText extends Vue {
  @Prop({ type: String, required: true }) type?: string;
  @Prop({ type: String, required: false }) label?: string;
  @Prop({ type: String, required: false }) help?: string;
  @Prop({ type: [String, Number], required: false }) modelValue?: string;

  uuid = Uniques.CreateIdAttribute();

  // TODO: modify class output based on text like input fields vs. widget fields
  // TODO: include a basic help text prop as well.
}
</script>
