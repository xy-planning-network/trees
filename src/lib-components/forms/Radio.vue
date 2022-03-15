<script setup lang="ts">
import Uniques from "@/helpers/Uniques"
import { computed, useAttrs, useSlots } from "vue"
import FieldsetLegend from "./FieldsetLegend.vue"
import InputHelp from "./InputHelp.vue"
import InputLabel from "./InputLabel.vue"

const props = withDefaults(
  defineProps<{
    options: {
      disabled?: boolean
      help?: string
      label: string
      value: string | number
    }[]
    help?: string
    legend?: string
    modelValue?: string | number
    columns?: 2 | 3 | 4
  }>(),
  {
    help: "",
    legend: "",
    modelValue: undefined,
    columns: undefined,
  }
)
const emits = defineEmits(["update:modelValue"])
const attrs = useAttrs()
const slots = useSlots()
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()
const hasLegend = computed(() => {
  return props.legend !== "" || slots.legend !== undefined
})
</script>
<template>
  <fieldset
    class="space-y-5"
    :aria-labelledby="hasLegend ? `${uuid}-legend` : undefined"
    :aria-describedby="help ? `${uuid}-help` : undefined"
  >
    <div class="space-y-0.5">
      <FieldsetLegend :id="`${uuid}-legend`">
        <div v-if="legend">{{ legend }}</div>
        <slot v-if="$slots.legend" name="legend"></slot>
      </FieldsetLegend>
      <InputHelp tag="p" :text="help" :id="`${uuid}-help`" />
    </div>
    <div
      class="grid gap-4"
      :class="{
        'sm:grid sm:gap-y-4 sm:gap-x-5 sm:space-y-0': columns !== undefined,
        'sm:grid-cols-2': columns === 2,
        'sm:grid-cols-3': columns === 3,
        'sm:grid-cols-4': columns === 4,
      }"
    >
      <div
        v-for="(option, index) in options"
        :key="option.value"
        class="flex items-start"
      >
        <div class="flex items-center h-5">
          <input
            :aria-describedby="
              option?.help && option.help ? `${uuid}-${index}-help` : undefined
            "
            :aria-labelledby="`${uuid}-${index}-label`"
            :checked="modelValue === option.value"
            class="w-4 h-4 border-gray-600 focus:ring-blue-500 text-xy-blue disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="option.disabled === true ? true : undefined"
            :id="`${uuid}-${index}`"
            :name="uuid"
            type="radio"
            :value="option.value"
            v-bind="{
              onChange: () => {
                emits('update:modelValue', option.value)
              },
              ...$attrs,
            }"
          />
        </div>
        <div class="ml-3">
          <InputLabel
            class="mt-auto"
            :disabled="
              ($attrs.hasOwnProperty('disabled') &&
                $attrs.disabled !== false) ||
              option.disabled === true
            "
            :id="`${uuid}-${index}-label`"
            :for="uuid"
            :label="option.label"
          />
          <InputHelp
            class="-mt-1"
            :id="`${uuid}-${index}-help`"
            :text="option.help"
          />
        </div>
      </div>
    </div>
  </fieldset>
</template>
