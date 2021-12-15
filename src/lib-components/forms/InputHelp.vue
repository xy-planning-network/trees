<template>
  <component
    :is="tag"
    v-if="text"
    v-bind="{
      ...$attrs,
      class: 'mt-2 text-sm leading-snug font-semibold text-gray-700',
    }"
  >
    {{ text }}
  </component>
</template>
<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator"

@Options({ name: "InputHelp" })
export default class InputHelp extends Vue {
  @Prop({ type: String, required: false }) text?: string
  @Prop({ type: String, required: false, default: "div" }) tag?: string
}
</script>
