<template>
  <div class="relative flex items-start">
    <div class="h-5 flex items-center">
      <input
        :aria-labelledby="label ? `${uuid}-label` : undefined"
        :checked="modelValue"
        class="focus:ring-blue-500 h-4 w-4 text-blue-500 border-gray-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        :id="uuid"
        type="checkbox"
        v-bind="{
          ...$attrs,
          onChange: ($event) => {
            $emit('update:modelValue', $event.target.checked)
          },
        }"
      />
    </div>
    <div class="ml-3 text-sm font-semibold leading-snug text-gray-900">
      <label :id="`${uuid}-label`" :for="uuid" v-text="label"></label>
    </div>
  </div>
</template>

<script lang="ts">
import Uniques from "@/helpers/Uniques"
import { Options, Prop, Vue } from "vue-property-decorator"

@Options({ name: "Checkbox" })
export default class Checkbox extends Vue {
  // TODO: checkbox should support the help text prop like base input, and label should use the label component or possible support a legend prop
  @Prop({ type: Boolean, required: false }) emphasis?: boolean
  @Prop({ type: String, required: false }) label?: string
  @Prop({ type: Boolean, required: true }) modelValue!: boolean

  uuid = (this.$attrs.id as string) || Uniques.CreateIdAttribute()
}
</script>
