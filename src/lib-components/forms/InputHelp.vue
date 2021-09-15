<template>
  <div
    class="my-2 text-sm leading-snug font-normal text-gray-500"
    v-bind="$attrs"
    v-if="text"
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
