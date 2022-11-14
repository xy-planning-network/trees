<script setup lang="ts">
import { computed } from "vue"
import type { Field } from "@/composables/forms"
import { FieldMap } from "@/composables/forms"

const emit = defineEmits(["update:modelValue"])
const props = defineProps<{
  field: Field
  modelValue?: any
}>()

const component = computed(() => {
  return FieldMap[props.field.type] || null
})
</script>

<template>
  <component
    :is="component"
    v-bind="{
      ...props.field,
      legend: props.field.label,
    }"
    :modelValue="props.modelValue"
    @update:model-value="(v: any) => emit('update:modelValue', v)"
  />
</template>
