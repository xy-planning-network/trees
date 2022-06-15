<script setup lang="ts">
import Uniques from "@/helpers/Uniques"
import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption,
} from "@headlessui/vue"
import { CheckCircleIcon } from "@heroicons/vue/solid"
import { computed, ref, useAttrs } from "vue"
import FieldsetLegend from "./FieldsetLegend.vue"

type ModelValue = string | number

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
    modelValue?: ModelValue
    options: RadioCard[]
  }>(),
  {
    columns: undefined,
    help: "",
    legend: "",
    modelValue: undefined,
  }
)

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValue): void
}>()

const attrs = useAttrs()
const uuid = (attrs.id as string) || Uniques.CreateIdAttribute()

// tracking internal state separate from modelValue
// allows v-model to be undefined by the consumer but still supports
// the display requirements of the component.
// this is usful when the component is used inside a form element and
// tracking v-model isn't required.
const internalState = ref()
const checked = computed(() => {
  if (props.modelValue === undefined) {
    return internalState.value
  }

  return props.modelValue
})

// manage some custom required validation using an invisible input field
const validationInputRef = ref<any>()
const invalid = ref<boolean>()
const errMsg = "Please select one of these options."
const onInvalid = () => {
  if (validationInputRef.value === undefined) {
    return
  }

  invalid.value = true
  validationInputRef.value.setCustomValidity(errMsg)
}

const onChange = (val: ModelValue) => {
  internalState.value = val
  emit("update:modelValue", val)

  if (validationInputRef.value === undefined) {
    return
  }

  invalid.value = false
  validationInputRef.value.setCustomValidity("")
}
</script>

<template>
  <RadioGroup
    :modelValue="checked"
    @update:model-value="onChange"
    :disabled="typeof attrs.disabled === 'boolean' ? attrs.disabled : false"
    :name="attrs.name ? attrs.name : uuid"
    :aria-invalid="invalid === true ? 'true' : null"
    :aria-errormessage="invalid === true ? `error-${uuid}` : null"
  >
    <RadioGroupLabel v-if="legend" class="block">
      <FieldsetLegend tag="div">{{ legend }}</FieldsetLegend>
    </RadioGroupLabel>
    <RadioGroupDescription v-if="help">
      <InputHelp :text="help" />
    </RadioGroupDescription>
    <div v-if="invalid === true" :id="`error-${uuid}`" class="sr-only">
      {{ errMsg }}
    </div>

    <div
      class="mt-4 grid grid-cols-1 gap-y-5 gap-x-4 relative"
      :class="{
        'sm:grid-cols-2': columns === 2,
        'sm:grid-cols-3': columns === 3,
      }"
    >
      <RadioGroupOption
        as="template"
        v-for="option in options"
        :disabled="option?.disabled ? option.disabled : false"
        :key="option.value"
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
              <div v-if="option.sublabel" class="mt-auto mb-0">
                <RadioGroupDescription as="div" class="mt-4">
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
      <input
        ref="validationInputRef"
        class="absolute sr-only top-1 left-4"
        aria-hidden="true"
        type="checkbox"
        :checked="internalState !== undefined"
        :required="attrs.required !== undefined && attrs.required !== false"
        @invalid="onInvalid"
      />
    </div>
  </RadioGroup>
</template>
