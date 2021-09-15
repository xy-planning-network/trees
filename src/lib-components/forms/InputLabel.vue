<template>
  <label
    class="my-2 text-sm font-semibold leading-snug text-gray-900"
    v-bind="$attrs"
    v-if="label"
    >{{ label }}</label
  >
</template>
<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";

@Options({ name: "InputLabel" })
export default class InputText extends Vue {
  @Prop({ type: String, required: false }) label?: string;
}
</script>
