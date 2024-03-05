<script setup lang="ts">
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import { useInputField, defaultInputProps } from "@/composables/forms"
import type {
  InputOption,
  MultiChoiceInput,
  OptionsInput,
} from "@/composables/forms"
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

const props = withDefaults(defineProps<MultiChoiceInput>(), defaultInputProps)

defineEmits(["update:modelValue", "update:error"])
const { errorState, inputID, isDisabled, isRequired, modelState, onInvalid } =
  useInputField(props)

const selectedOptions = computed(() => {
  if (Array.isArray(modelState.value)) {
    return props.options.filter((option) => {
      return modelState.value?.includes(option.value)
    })
  }

  return []
})

const query = ref("")
const filteredOptions = computed(() =>
  query.value === ""
    ? props.options
    : props.options.filter((option) => {
        return option.label.toLowerCase().includes(query.value.toLowerCase())
      })
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
 * TODO: (spk) add display for selected options with remove callback.
 * TODO: (spk) add min/max validation support (required = min=1).
 * TODO: (spk) add allow create option as prop.
 * TODO: (spk) add query display
 * TODO: (spk) disabled display support
 * TODO: (spk) placeholder support
 * TODO: (spk) first item is always pre-selected, can we avoid this?
 * https://github.com/tailwindlabs/headlessui/issues/2932
 */

const remove = (val: any) => {
  modelState.value?.splice(modelState.value.indexOf(val), 1)
}
</script>

<template>
  <div>
    <ComboboxHeadless
      v-slot="{ open }"
      v-model="modelState"
      :disabled="isDisabled"
      :name="typeof $attrs['name'] === 'string' ? $attrs['name'] : ''"
      multiple
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
        <div
          :class="[
            'bg-white min-h-[40px] block w-full rounded-md border-0 py-2 px-3 shadow-sm ring-1 ring-inset focus:ring-2 sm:text-sm sm:leading-6',
            'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-700 disabled:ring-gray-200',
            modelState ? 'pr-16' : 'pr-8',
            errorState
              ? 'text-red-900 ring-red-700 placeholder:text-red-300 focus:ring-red-700'
              : 'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-xy-blue-500',
          ]"
        >
          <ul v-if="selectedOptions.length > 0" class="flex flex-wrap -mx-0.5">
            <li
              v-for="option in selectedOptions"
              :key="option.value"
              class="xy-badge-blue inline-flex items-center gap-x-1 group cursor-pointer mx-0.5"
              @click="remove(option.value)"
            >
              <span>{{ option.label }}</span>
              <button
                type="button"
                class="group relative -mr-1.5 h-3.5 w-3.5 rounded-sm group-hover:bg-gray-500/10 inline-flex items-center justify-center"
              >
                <span class="sr-only">Remove</span>
                <XIcon
                  class="h-3 w-3 stroke-gray-500/20 group-hover:stroke-gray-500/75"
                />
                <!--makes the clickable target larger-->
                <span class="absolute -inset-2" />
              </button>
            </li>
          </ul>
        </div>

        <ComboboxInput
          :id="inputID"
          ref="input"
          class="sr-only"
          :display-value="() => selectedOptions.join(',')"
          :aria-describedby="help ? `${inputID}-help` : undefined"
          :aria-errormessage="errorState ? `${inputID}-error` : undefined"
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
            :class="
              modelState && modelState.length > 0 && !isDisabled
                ? 'block'
                : 'hidden'
            "
            type="button"
            @click="
              () => {
                modelState = []
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
