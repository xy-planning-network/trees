<template>
  <div class="mt-12">
    <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="feature in features" :key="feature.name" class="pt-6">
        <div
          class="flow-root bg-gray-50 rounded-lg px-6 pb-8 cursor-pointer hover:bg-gray-100"
          @click="updateModelValue(feature.name)"
        >
          <div class="-mt-6">
            <div>
              <span
                class="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg"
              >
                <component
                  :is="feature.icon"
                  class="h-6 w-6 text-white"
                  aria-hidden="true"
                />
              </span>
            </div>
            <h3 class="mt-8 text-lg font-medium text-gray-900 tracking-tight">
              {{ feature.name }}
            </h3>
            <p class="mt-5 text-base text-gray-500">
              Ac tincidunt sapien vehicula erat auctor pellentesque rhoncus. Et
              magna sit morbi lobortis.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Emit, Prop, Vue } from "vue-property-decorator";
import {
  BellIcon,
  CursorClickIcon,
  DocumentTextIcon,
  TableIcon,
  UserGroupIcon,
  ViewBoardsIcon,
} from "@heroicons/vue/outline";

export default class Serve extends Vue {
  @Prop({ type: String, required: true }) modelValue!: string;

  @Emit("update:modelValue")
  updateModelValue(modelValue: string): string {
    return modelValue;
  }

  features = [
    { name: "Forms", icon: DocumentTextIcon },
    { name: "Layout & Navigation", icon: ViewBoardsIcon },
    { name: "Lists", icon: TableIcon },
    { name: "Clicking Around", icon: CursorClickIcon },
    { name: "Screen Takeovers", icon: BellIcon },
    { name: "Team", icon: UserGroupIcon },
  ];
}
</script>
