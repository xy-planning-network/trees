<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import { useInputField, defaultInputProps } from "@/composables/forms"
import type { OptionsInput } from "@/composables/forms"
import { computed, ref, watch } from "vue"
import {
  Combobox as ComboboxHeadless,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue"
import { CheckIcon, SelectorIcon, XIcon } from "@heroicons/vue/solid"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<OptionsInput>(), defaultInputProps)

defineEmits(["update:modelValue", "update:error"])
const { errorState, inputID, isDisabled, isRequired, modelState, onInvalid } =
  useInputField(props)

const selectedLabel = computed(() => {
  return (
    props.options.find((option) => {
      return modelState.value === option.value
    })?.label || ""
  )
})

const query = ref("")
const filteredOptions = computed(() =>
  // TODO: more advanced logic here.
  // when modelState is empty, just concat the current typed item on to the filter.

  // when modelState is not empty and equals the value of query.

  query.value === "" || query.value === modelState.value
    ? props.options
    : [
        { label: query.value, value: query.value },
        ...props.options.filter((option) => {
          return option.label.toLowerCase().includes(query.value.toLowerCase())
        }),
      ]
)

/**
 * validation for the required attribute
 */
const input = ref<InstanceType<typeof ComboboxInput> | null>(null)
watch(modelState, () => {
  if (!input.value || !errorState.value) {
    return
  }

  const target = input.value.$el as HTMLInputElement
  if (target.checkValidity()) {
    errorState.value = target.validationMessage
  } else {
    errorState.value = ""
  }
})

/**
 * open the combobox when the input is focused
 * NOTE: (spk) has the problem that when tab is clicked and focus is made, a second tab selects
 * the first item...
 *
 * https://github.com/tailwindlabs/headlessui/pull/2686
 *
 */
const button = ref<InstanceType<typeof ComboboxButton> | null>(null)

/**
 * TODO: (spk) add allow create option as prop.
 * TODO: (spk) first item is always pre-selected, can we avoid this?
 * https://github.com/tailwindlabs/headlessui/issues/2932
 */
</script>

<template>
  <div>
    <ComboboxHeadless
      v-slot="{ open }"
      v-model="modelState"
      :disabled="isDisabled"
      :name="typeof $attrs['name'] === 'string' ? $attrs['name'] : ''"
      nullable
    >
      <ComboboxLabel v-if="label">
        <InputLabel
          tag="div"
          class="mb-2"
          :label="label"
          :required="isRequired"
        />
      </ComboboxLabel>

      <div class="relative">
        <ComboboxInput
          :id="inputID"
          ref="input"
          :aria-describedby="help ? `${inputID}-help` : undefined"
          :aria-errormessage="errorState ? `${inputID}-error` : undefined"
          :class="[
            'block w-full rounded-md border-0 py-2 shadow-sm ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-700 disabled:ring-gray-200',
            modelState ? 'pr-16' : 'pr-8',
            errorState
              ? 'text-red-900 ring-red-700 placeholder:text-red-300 focus:ring-red-700'
              : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-xy-blue-500',
          ]"
          :display-value="() => selectedLabel"
          :placeholder="placeholder"
          :required="isRequired"
          @change="query = $event.target.value"
          @click="() => (!open ? button?.$el.click() : null)"
          @invalid="onInvalid"
        />

        <!--Open & clear buttons-->
        <div
          class="absolute inset-y-0 right-0 flex gap-x-2.5 items-center rounded-r-md px-2 focus:outline-none"
        >
          <button
            :class="modelState && !isDisabled ? 'block' : 'hidden'"
            type="button"
            @click="
              () => {
                modelState = ''
                query = ''
              }
            "
          >
            <XIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </button>

          <ComboboxButton
            ref="button"
            class="w-full cursor-pointer border-none bg-none text-inherit outline-none"
          >
            <SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>

        <ComboboxOptions
          v-if="filteredOptions.length > 0"
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ComboboxOption
            v-for="option in filteredOptions"
            :key="option.value"
            v-slot="{
              active,
              disabled,
              selected,
            }: {
              active: boolean,
              disabled: boolean,
              selected: boolean,
            }"
            :disabled="option.disabled"
            :value="option.value"
            as="template"
          >
            <li
              :class="[
                'relative select-none py-2 pl-3 pr-9',
                active ? 'bg-xy-blue text-white' : '',
                disabled
                  ? 'cursor-not-allowed text-gray-400'
                  : 'cursor-pointer',
                !active && !disabled ? 'text-gray-800' : '',
              ]"
            >
              <span :class="['block truncate', selected && 'font-semibold']">
                {{ option.label }}
              </span>

              <span
                v-if="selected"
                :class="[
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                  active ? 'text-white' : 'text-xy-blue',
                ]"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </div>
    </ComboboxHeadless>
    <InputHelp :id="`${inputID}-help`" class="mt-1" :text="help" />
    <InputError :id="`${inputID}-error`" class="mt-0.5" :text="errorState" />
  </div>
</template>
