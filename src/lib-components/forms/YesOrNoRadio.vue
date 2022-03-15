<script setup lang="ts">
import Uniques from "@/helpers/Uniques"
import { computed, useAttrs } from "vue"
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    help?: string
    legend?: string
    name?: string
  }>(),
  {
    modelValue: undefined,
    help: "",
    legend: "",
    name: "",
  }
)
const emits = defineEmits(["update:modelValue"])
const attrs = useAttrs()
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()
const hasNameAttr = computed((): boolean => {
  return typeof props.name === "string" && props.name !== ""
})
const onChange = (e: Event) => {
  emits("update:modelValue", (e.target as HTMLInputElement).value === "true")
}
</script>
<template>
  <fieldset
    class="space-y-3"
    :aria-labelledby="legend ? `${uuid}-legend` : undefined"
    :aria-describedby="help ? `${uuid}-help` : undefined"
  >
    <div v-if="legend || help" class="space-y-0.5">
      <InputLabel
        class="block my-auto"
        :label="legend"
        tag="legend"
      ></InputLabel>
      <InputHelp tag="p" :text="help" :id="`${uuid}-help`" />
    </div>
    <div>
      <label
        class="inline-flex items-center"
        :class="{ 'cursor-not-allowed': $attrs.disabled }"
        :for="`${hasNameAttr ? name : uuid}-true`"
      >
        <input
          type="radio"
          class="w-4 h-4 border-gray-600 focus:ring-blue-500 text-xy-blue disabled:opacity-50 disabled:cursor-not-allowed"
          :id="`${hasNameAttr ? name : uuid}-true`"
          :name="hasNameAttr ? name : uuid"
          :value="true"
          :checked="modelValue === true"
          v-bind="{
            ...$attrs,
            onChange: onChange,
          }"
        />
        <InputLabel
          class="ml-2"
          :disabled="
            $attrs.hasOwnProperty('disabled') && $attrs.disabled !== false
          "
          label="Yes"
          tag="span"
        ></InputLabel>
      </label>
      <label
        class="inline-flex items-center ml-6"
        :class="{ 'cursor-not-allowed': $attrs.disabled }"
        :for="`${hasNameAttr ? name : uuid}-false`"
      >
        <input
          type="radio"
          class="w-4 h-4 border-gray-600 focus:ring-blue-500 text-xy-blue disabled:opacity-50 disabled:cursor-not-allowed"
          :id="`${hasNameAttr ? name : uuid}-false`"
          :name="hasNameAttr ? name : uuid"
          :value="false"
          :checked="modelValue === false"
          v-bind="{
            ...$attrs,
            onChange: onChange,
          }"
        />
        <InputLabel
          class="ml-2"
          :disabled="
            $attrs.hasOwnProperty('disabled') && $attrs.disabled !== false
          "
          label="No"
          tag="span"
        ></InputLabel>
      </label>
    </div>
  </fieldset>
</template>
