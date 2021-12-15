<template>
  <fieldset>
    <InputLabel class="block" :label="legend" tag="legend"></InputLabel>
    <label
      class="inline-flex items-center"
      :class="{ 'cursor-not-allowed': $attrs.disabled }"
      :for="`${hasNameAttr ? name : uuid}-true`"
    >
      <input
        type="radio"
        class="w-4 h-4 border-gray-600 focus:ring-blue-500 text-xy-blue"
        :id="`${hasNameAttr ? name : uuid}-true`"
        :name="hasNameAttr ? name : uuid"
        :value="true"
        :checked="modelValue === true"
        v-bind="{
          ...$attrs,
          onChange: ($event) => {
            $emit('update:modelValue', $event.target.value === 'true')
          },
        }"
      />
      <span class="block ml-2 text-sm font-semibold text-gray-900">Yes</span>
    </label>
    <label
      class="inline-flex items-center ml-6"
      :class="{ 'cursor-not-allowed': $attrs.disabled }"
      :for="`${hasNameAttr ? name : uuid}-false`"
    >
      <input
        type="radio"
        class="w-4 h-4 border-gray-600 focus:ring-blue-500 text-xy-blue"
        :id="`${hasNameAttr ? name : uuid}-false`"
        :name="hasNameAttr ? name : uuid"
        :value="false"
        :checked="modelValue === false"
        v-bind="{
          ...$attrs,
          onChange: ($event) => {
            $emit('update:modelValue', $event.target.value === 'true')
          },
        }"
      />
      <span class="block ml-2 text-sm font-semibold text-gray-900">No</span>
    </label>
  </fieldset>
</template>

<script lang="ts">
import Uniques from "@/helpers/Uniques"
import { Options, Prop, Vue } from "vue-property-decorator"
import InputLabel from "./InputLabel.vue"

@Options({ name: "YesOrNoRadio", components: { InputLabel } })
export default class YesOrNoRadio extends Vue {
  @Prop({ type: Boolean, required: false }) modelValue?: boolean
  @Prop({ type: String, required: false }) legend?: string
  @Prop({ type: String, required: false, default: "" }) name?: string

  uuid = (this.$attrs.id as string) || Uniques.CreateIdAttribute()

  get hasNameAttr(): boolean {
    return typeof this.name === "string" && this.name !== ""
  }
}
</script>
