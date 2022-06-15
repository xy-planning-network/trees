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

/*
 * NOTE (spk) headless UI introduced a "name" prop that includes a hidden field
 * to use the modelValue inside of forms.  It does not however resolve the issue of
 * supporting HTML5 form validation, so we'll add our own hidden radio buttons to support both.
 *
 * The headless technique does include supporting complex modelValues such as objects, which we may
 * need in the future.  We can revist required validation at that time using a singular hidden checkbox.
 */

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
const invalid = ref<boolean>()
const checked = computed(() => {
  if (props.modelValue === undefined) {
    return internalState.value
  }

  return props.modelValue
})

const onChange = (val: ModelValue) => {
  internalState.value = val
  invalid.value = false
  emit("update:modelValue", val)
}

const nameAttr = computed(() => {
  return typeof attrs.name === "string" && attrs.name !== "" ? attrs.name : uuid
})
</script>

<template>
  <RadioGroup
    :modelValue="checked"
    @update:model-value="onChange"
    :disabled="typeof attrs.disabled === 'boolean' ? attrs.disabled : false"
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
      Please select one of these options.
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
              <div
                v-if="option.sublabel || $slots.sublabel"
                class="mt-auto mb-0"
              >
                <RadioGroupDescription
                  as="div"
                  class="font-semibold leading-snug mt-4 text-gray-900 text-sm"
                >
                  {{ option.sublabel }}
                  <slot
                    name="sublabel"
                    :active="active"
                    :checked="checked"
                    :disabled="disabled"
                    :option="option"
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
          <input
            class="sr-only top-1 left-1"
            aria-hidden="true"
            :checked="checked"
            :name="nameAttr"
            :required="attrs.required !== undefined && attrs.required !== false"
            tabindex="-1"
            type="radio"
            :value="option.value"
            @invalid="invalid = true"
          />
        </div>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
