<template>
  <InputLabel
    class="block"
    :id="`${uuid}-label`"
    :for="uuid"
    :label="label"
  ></InputLabel>
  <input
    :aria-labelledby="label ? `${uuid}-label` : undefined"
    :aria-describedby="help ? `${uuid}-help` : undefined"
    :class="[
      ...['mt-1', 'sm:text-sm'],
      ...(isTextType
        ? [
            'block',
            'shadow-sm',
            'focus:ring-blue-500',
            'focus:border-blue-500',
            'border-gray-300',
            'rounded-md',
            'w-full',
          ]
        : []),
    ]"
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

@Options({ name: "BaseInput" })
export default class BaseInput extends Vue {
  @Prop({ type: String, required: true }) type?: string;
  @Prop({ type: String, required: false }) label?: string;
  @Prop({ type: String, required: false }) help?: string;
  @Prop({ type: [String, Number], required: false }) modelValue?: string;

  uuid = Uniques.CreateIdAttribute();

  /**
   * common text based inputs
   */
  textInputTypes = [
    "date",
    "datetime-local",
    "email",
    "month",
    "number",
    "password",
    "search",
    "tel",
    "text",
    "time",
    "url",
    "week",
  ];

  /**
   * determine if this input is a common text based input
   */
  get isTextType(): boolean {
    return (
      typeof this.type === "string" && this.textInputTypes.includes(this.type)
    );
  }
}
</script>
