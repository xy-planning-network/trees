<script setup lang="ts">
import { onUnmounted, useAttrs } from "vue"
import debounce from "lodash.debounce"
import { SearchIcon } from "@heroicons/vue/solid"
import Uniques from "@/helpers/Uniques"

const attrs = useAttrs()
const props = withDefaults(
  defineProps<{
    debounce?: number // 0 disables debouncing 'input' emits
    label?: string
    modelValue: string
  }>(),
  {
    debounce: 300,
    label: "Search",
  }
)

const emits = defineEmits(["update:modelValue"])
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()
const localDebounce = debounce((key: string, value: string) => emits(key, value), props.debounce)
onUnmounted(() => localDebounce.cancel())
</script>
<template>
  <label :for="uuid" class="sr-only">{{ label }}</label>
  <div class="relative">
    <div
      class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
    >
      <SearchIcon class="w-5 h-5 text-gray-400" />
    </div>
    <input
      :aria-labelledby="label ? `${uuid}-label` : undefined"
      :id="uuid"
      :for="uuid"
      class="pl-10"
      type="search"
      placeholder="Search"
      v-bind="{
        ...$attrs,
        onInput: ($event) => localDebounce('update:modelValue', $event.target.value.trim())
      }"
    />
  </div>
</template>
