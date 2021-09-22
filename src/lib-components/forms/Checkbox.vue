<template>
  <div class="relative flex items-start">
    <div class="h-5 flex items-center">
      <input
        :aria-labelledby="label ? `${uuid}-label` : undefined"
        :checked="modelValue"
        class="focus:ring-blue-500 h-4 w-4 text-xy-blue border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        :id="uuid"
        type="checkbox"
        v-bind="{
          ...$attrs,
          onChange: ($event) => {
            $emit('update:modelValue', $event.target.checked);
          },
        }"
      />
    </div>
    <div class="ml-3 text-sm leading-5">
      <label
        :id="`${uuid}-label`"
        :for="uuid"
        class="text-gray-500"
        :class="{ 'font-medium': emphasis }"
        v-text="label"
      ></label>
    </div>
  </div>
</template>

<script lang="ts">
import Uniques from "@/helpers/Uniques";
import { Options, Prop, Vue } from "vue-property-decorator";

@Options({ name: "Checkbox" })
export default class Checkbox extends Vue {
  @Prop({ type: Boolean, required: false }) emphasis?: boolean;
  @Prop({ type: String, required: false }) label?: string;
  @Prop({ type: Boolean, required: true }) modelValue!: boolean;

  uuid = (this.$attrs.id as string) || Uniques.CreateIdAttribute();
}
</script>
