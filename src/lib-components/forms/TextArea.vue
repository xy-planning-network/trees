<template>
  <InputLabel
    class="block"
    :id="`${uuid}-label`"
    :for="uuid"
    :label="label"
  ></InputLabel>
  <textarea
    :aria-labelledby="label ? `${uuid}-label` : undefined"
    :aria-describedby="help ? `${uuid}-help` : undefined"
    :class="[
      'mt-1',
      'sm:text-sm',
      'block',
      'shadow-sm',
      'focus:ring-blue-500',
      'focus:border-blue-500',
      'border-gray-300',
      'rounded-md',
      'w-full',
    ]"
    :id="uuid"
    :placeholder="label"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    v-bind="$attrs"
  />
  <InputHelp :id="`${uuid}-help`" :text="help"></InputHelp>
</template>

<script lang="ts">
import Uniques from "@/helpers/Uniques";
import { Options, Prop, Vue } from "vue-property-decorator";
import InputLabel from "./InputLabel.vue";
import InputHelp from "./InputHelp.vue";

@Options({ name: "TextArea", components: { InputLabel, InputHelp } })
export default class TextArea extends Vue {
  @Prop({ type: String, required: false }) label?: string;
  @Prop({ type: String, required: false }) help?: string;
  @Prop({ type: [String, Number], required: false }) modelValue?: string;

  uuid = (this.$attrs.id as string) || Uniques.CreateIdAttribute();
}
</script>
