<template>
  <div>
    <div class="sm:hidden" :class="{ 'mb-4': pillDesign }">
      <label for="tabs" class="sr-only">Select a tab</label>
      <Select
        name="tabs"
        :modelValue="modelValue"
        @update:modelValue="updateModelValue($event)"
        :options="tabs"
      />
    </div>
    <div class="hidden sm:block">
      <div :class="{ 'border-b border-gray-200': notPillDesign }">
        <nav class="flex" :class="[pillDesign ? 'ml-8' : '-mb-px']">
          <a
            href="#"
            :class="classes(tab.value, idx > 0)"
            v-for="(tab, idx) in tabs"
            :key="idx"
            v-text="tab.label"
            @click.prevent="updateModelValue(tab.value)"
          >
          </a>
        </nav>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Emit, Options, Prop, Vue } from "vue-property-decorator";

@Options({ name: "Tabs" })
export default class Tabs extends Vue {
  @Prop({ type: String, required: true }) modelValue!: string;
  @Prop({ type: Boolean, required: true }) pillDesign?: boolean;
  @Prop({ type: Array, required: true }) tabs!: Array<{
    label: string;
    value: string;
  }>;

  @Emit("update:modelValue")
  updateModelValue(modelValue: string): string {
    return modelValue;
  }

  classes(currentTab: string, pastFirstTab: boolean): string {
    let c = "";

    if (this.pillDesign) {
      c =
        "px-12 py-2 font-semibold text-md leading-5 rounded-t-md focus:outline-none ";

      if (this.modelValue === currentTab) {
        c =
          c +
          "focus:bg-white text-gray-700 bg-white border-b-2 border-blue-500";
      } else {
        c =
          c +
          "text-gray-700 hover:text-gray-900 focus:text-gray-900 focus:bg-gray-100 border border-gray-200";
      }

      return c;
    }

    c =
      "px-1 py-4 text-sm font-semibold border-b-2 whitespace-nowrap leading-5 focus:outline-none ";
    if (this.modelValue === currentTab) {
      c =
        c +
        "border-blue-500 text-xy-blue focus:text-blue-800 focus:border-blue-700";
    } else {
      c =
        c +
        "border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300 focus:text-gray-900 focus:border-gray-300";
    }

    if (pastFirstTab) c = c + " ml-8";

    return c;
  }

  get notPillDesign(): boolean {
    return !this.pillDesign;
  }
}
</script>
