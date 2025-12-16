<script setup lang="ts" generic="T extends InputOption">
import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption,
} from "@headlessui/vue"
import { CheckCircleIcon } from "@heroicons/vue/solid"
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import FieldsetLegend from "./FieldsetLegend.vue"
import {
  defaultInputProps,
  defaultModelOpts,
  useInputField,
} from "@/composables/forms"
import type {
  ColumnedInput,
  InputOption,
  OptionsInput,
} from "@/composables/forms"

defineOptions({
  inheritAttrs: false,
})

/*
 * NOTE (spk) headless UI introduced a "name" prop that includes a hidden field
 * to use the modelValue inside of forms.  It does not however resolve the issue of
 * supporting HTML5 form validation, so we'll add our own hidden radio buttons to support both.
 */
interface RadioCards extends OptionsInput {
  options: T[]
}

const props = withDefaults(
  defineProps<RadioCards & ColumnedInput>(),
  defaultInputProps
)
const modelState = defineModel<
  RadioCards["modelValue"],
  "modelValue",
  string | number | undefined
>({
  ...defaultModelOpts,
  get: (v) => {
    // NOTE(spk): HeadlessUI RadioGroup does not support "null" values
    if (v === null) {
      return undefined
    }

    return v
  },
})

const { aria, isDisabled, isRequired, nameAttr, errorState, onInvalid } =
  useInputField(props)

const onUpdate = (val: unknown) => {
  if (val) {
    errorState.value = ""
  }
}
</script>

<template>
  <RadioGroup
    v-model="modelState"
    class="space-y-6"
    :disabled="isDisabled"
    :aria-invalid="errorState ? 'true' : null"
    :aria-errormessage="aria.errormessage"
    @update:model-value="onUpdate"
  >
    <div v-if="label || help || errorState">
      <RadioGroupLabel v-if="label" class="block">
        <FieldsetLegend tag="div" :label="label" :required="isRequired" />
      </RadioGroupLabel>

      <RadioGroupDescription v-if="help" class="mt-1">
        <InputHelp :text="help" />
      </RadioGroupDescription>

      <InputError :id="aria.errormessage" class="mt-1" :text="errorState" />
    </div>

    <div
      class="grid grid-cols-1 gap-y-5 gap-x-4 relative"
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
          active: boolean
          checked: boolean
          disabled: boolean
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
            errorState && !disabled ? 'border-red-700' : '',
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

          <!--TODO: (spk) ideally this would trigger a change event -->
          <input
            class="sr-only top-1 left-1"
            aria-hidden="true"
            :checked="checked"
            :name="nameAttr"
            :required="isRequired"
            tabindex="-1"
            type="radio"
            :value="option.value"
            @invalid="onInvalid"
          />
        </div>
      </RadioGroupOption>
    </div>
  </RadioGroup>
</template>
