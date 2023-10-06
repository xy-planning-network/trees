<script setup lang="ts">
import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption,
} from "@headlessui/vue"
import { CheckCircleIcon } from "@heroicons/vue/solid"
import { computed, ref } from "vue"
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import FieldsetLegend from "./FieldsetLegend.vue"
import { useInputField } from "@/composables/forms"

defineOptions({
  inheritAttrs: false,
})

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
    label?: string
    modelValue?: ModelValue
    options: RadioCard[]
  }>(),
  {
    columns: undefined,
    help: "",
    label: "",
    modelValue: undefined,
  }
)

const emit = defineEmits<{
  (e: "update:modelValue", modelValue: ModelValue): void
}>()

const { inputID, isDisabled, isRequired, nameAttr } = useInputField()

// tracking internal state separate from modelValue
// allows v-model to be undefined by the consumer but still supports
// the display requirements of the component.
// this is usful when the component is used inside a form element and
// tracking v-model isn't required.
const internalState = ref()
const invalid = ref<boolean>()
const checkedState = computed(() => {
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
</script>

<template>
  <RadioGroup
    :model-value="checkedState"
    :disabled="isDisabled"
    :aria-invalid="invalid === true ? 'true' : null"
    :aria-errormessage="invalid === true ? `error-${inputID}` : null"
    @update:model-value="onChange"
  >
    <RadioGroupLabel v-if="label" class="block">
      <FieldsetLegend tag="div" :label="label" />
    </RadioGroupLabel>

    <RadioGroupDescription v-if="help">
      <InputHelp :text="help" />
    </RadioGroupDescription>

    <div v-if="invalid === true" :id="`error-${inputID}`" class="sr-only">
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
        v-for="option in options"
        :key="option.value"
        v-slot="{
          active,
          checked,
          disabled,
        }: {
          active: boolean,
          checked: boolean,
          disabled: boolean,
        }"
        as="template"
        :disabled="isDisabled || option.disabled"
        :value="option.value"
      >
        <div
          class="relative border rounded-lg shadow-sm p-4 flex focus:outline-none"
          :class="[
            disabled
              ? 'cursor-not-allowed bg-gray-50 border-gray-200 opacity-90'
              : 'cursor-pointer bg-white border-gray-300',
            checked ? 'border-transparent' : '',
            active ? 'border-xy-blue ring-2 ring-xy-blue-500' : '',
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
                  class="text-sm/5 font-medium mt-4 text-gray-800"
                >
                  <slot
                    name="sublabel"
                    :active="active"
                    :checked="checked"
                    :disabled="disabled"
                    :option="option"
                    >{{ option.sublabel }}</slot
                  >
                </RadioGroupDescription>
              </div>
            </div>
          </div>
          <CheckCircleIcon
            :class="[!checked ? 'invisible' : '', 'h-5 w-5 text-xy-blue']"
            aria-hidden="true"
          />
          <div
            :class="[
              active ? 'border' : 'border-2',
              checked ? 'border-xy-blue' : 'border-transparent',
              'absolute -inset-px rounded-lg pointer-events-none',
            ]"
            aria-hidden="true"
          />

          <input
            class="sr-only top-1 left-1"
            aria-hidden="true"
            :checked="checked"
            :name="nameAttr"
            :required="isRequired"
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
