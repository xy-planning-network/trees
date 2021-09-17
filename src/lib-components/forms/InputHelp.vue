<template>
  <div
    v-if="text"
    v-bind="{
      ...$attrs,
      class: 'my-2 text-sm leading-snug font-normal text-gray-500',
    }"
  >
    {{ text }}
  </div>
</template>
<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";

@Options({ name: "InputHelp" })
export default class InputHelp extends Vue {
  @Prop({ type: String, required: false }) text?: string;
}
</script>
