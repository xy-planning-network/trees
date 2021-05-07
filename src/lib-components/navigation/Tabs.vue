<template>
  <div>
    <div class="sm:hidden mb-4">
      <label for="tabs" class="sr-only">Select a tab</label>
      <Select
        name="tabs"
        :modelValue="modelValue"
        @update:modelValue="updateModelValue($event)"
        :options="tabs"
      />
    </div>
    <div class="hidden sm:block">
      <nav class="flex ml-8">
        <a
          href="#"
          class="px-12 py-2 font-medium text-md leading-5 rounded-t-md focus:outline-none"
          v-for="(tab, idx) in tabs"
          :key="idx"
          v-text="tab.label"
          @click.prevent="updateModelValue(tab.value)"
          :class="{
            'focus:bg-white text-gray-700 bg-white border-b-2 border-blue-500':
              tab.value === modelValue,
            'text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:bg-gray-100 border border-gray-200':
              tab.value != modelValue,
          }"
        >
        </a>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { Emit, Prop, Vue } from "vue-property-decorator";

export default class Tabs extends Vue {
  @Prop({ type: Array, required: true }) tabs!: Array<{
    label: string;
    value: string;
  }>;
  @Prop({ type: String, required: true }) modelValue!: string;

  @Emit("update:modelValue")
  updateModelValue(modelValue: string): string {
    return modelValue;
  }
}
</script>
