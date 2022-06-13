<script setup lang="ts">
import Uniques from "@/helpers/Uniques"
import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption,
} from "@headlessui/vue"
import { CheckCircleIcon } from "@heroicons/vue/solid"
import { ref, useAttrs, watch } from "vue"
import FieldsetLegend from "./FieldsetLegend.vue"

type ModelValue = string | number

// TODO: support required and hidden field with name attribute

type RadioCard = {
  disabled?: boolean
  help?: string
  label: string
  sublabel?: string
  value: ModelValue
}

const props = withDefaults(
  defineProps<{
    columns?: 2 | 3
    help?: string
    legend?: string
    modelValue: ModelValue
    options: RadioCard[]
  }>(),
  {
    columns: undefined,
    help: "",
    legend: "",
  }
)

function getSelectedOption(val: ModelValue) {
  const selected = props.options.find((option) => option.value === val)
  return selected !== undefined ? selected.value : undefined
}

const selected = ref(getSelectedOption(props.modelValue))

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValue): void
}>()

const attrs = useAttrs()
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()

// if modelValue and selected are out of sync
// then modelValue was updated by the parent
watch(
  props,
  () => {
    if (props.modelValue !== selected.value) {
      selected.value = props.modelValue
    }
  },
  { deep: true }
)
</script>

<template>
  <RadioGroup
    v-model="selected"
    v-on:update:model-value="(val: ModelValue) => emit('update:modelValue', val)"
    :disabled="typeof attrs.disabled === 'boolean' ? attrs.disabled : false"
  >
    <RadioGroupLabel v-if="legend" class="block">
      <FieldsetLegend tag="div">{{ legend }}</FieldsetLegend>
    </RadioGroupLabel>
    <RadioGroupDescription v-if="help">
      <InputHelp :text="help" />
    </RadioGroupDescription>

    <div
      class="mt-4 grid gap-4"
      :class="{
        'sm:grid sm:space-y-0': columns !== undefined,
        'sm:grid-cols-2': columns === 2,
        'sm:grid-cols-3': columns === 3,
      }"
    >
      <RadioGroupOption
        as="template"
        v-for="option in options"
        :disabled="option?.disabled ? option.disabled : false"
        :key="option.value"
        :name="attrs?.name ? attrs.name : uuid"
        :value="option.value"
        v-slot="{ active, checked, disabled }"
      >
        <div
          :class="[
            checked ? 'border-transparent' : 'border-gray-300',
            active ? 'border-blue-500 ring-2 ring-blue-500' : '',
            'relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none',
            disabled ? 'opacity-75' : '',
          ]"
        >
          <div class="flex-1 flex pr-1">
            <div class="flex flex-col">
              <RadioGroupLabel as="div">
                <InputLabel
                  tag="div"
                  class="mt-auto mb-auto"
                  :label="option.label"
                />
              </RadioGroupLabel>
              <RadioGroupDescription v-if="option.help" as="div">
                <InputHelp tag="div" class="mt-auto" :text="option.help" />
              </RadioGroupDescription>
              <div class="mt-auto mb-0">
                <RadioGroupDescription
                  v-if="option.sublabel"
                  as="div"
                  class="mt-4"
                >
                  <InputLabel
                    tag="span"
                    class="mt-auto mb-auto"
                    :label="option.sublabel"
                  />
                </RadioGroupDescription>
              </div>
            </div>
          </div>
          <CheckCircleIcon
            :class="[!checked ? 'invisible' : '', 'h-5 w-5 text-blue-600']"
            aria-hidden="true"
          />
          <div
            :class="[
              active ? 'border' : 'border-2',
              checked ? 'border-blue-500' : 'border-transparent',
              'absolute -inset-px rounded-lg pointer-events-none',
            ]"
            aria-hidden="true"
          />
        </div>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
