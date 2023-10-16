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
import { defaultInputProps, useInputField } from "@/composables/forms"
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

defineEmits(["update:modelValue", "update:error"])
const {
  aria,
  isDisabled,
  isRequired,
  nameAttr,
  modelState,
  errorState,
  onInvalid,
} = useInputField(props)

const onUpdate = (val: unknown) => {
  if (val) {
    errorState.value = ""
  }
}
</script>

<template>
  <RadioGroup
    v-model="modelState"
    :disabled="isDisabled"
    :aria-invalid="errorState ? 'true' : null"
    :aria-errormessage="aria.errormessage"
    @update:model-value="onUpdate"
  >
    <RadioGroupLabel v-if="label" class="block">
      <FieldsetLegend tag="div" :label="label" :required="isRequired" />
    </RadioGroupLabel>

    <RadioGroupDescription v-if="help">
      <InputHelp :text="help" />
    </RadioGroupDescription>

    <InputError :id="aria.errormessage" :text="errorState" />

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
