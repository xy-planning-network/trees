<template>
  <component
    :is="tag"
    v-if="label"
    v-bind="{
      ...$attrs,
      class: 'block my-1 text-sm font-semibold leading-snug text-gray-900',
    }"
    >{{ label }}</component
  >
</template>
<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator"

@Options({ name: "InputLabel" })
export default class InputLabel extends Vue {
  @Prop({ type: String, required: false }) label?: string
  @Prop({ type: String, required: false, default: "label" }) tag?: string
}
</script>
