<template>
  <a :href="propsData[attribute]">
    <DownloadIcon class="h-6 w-6 group-hover:text-gray-500 transition" />
  </a>
</template>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator"
import { DownloadIcon } from "@heroicons/vue/solid"

@Options({ name: "DownloadCell", components: { DownloadIcon } })
export default class DownloadCell extends Vue {
  @Prop({ type: Object, required: true }) propsData!: Record<string, unknown>
  @Prop({ type: String, required: true }) attribute!: string
}
</script>
