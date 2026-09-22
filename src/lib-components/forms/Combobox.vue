<script setup lang="ts">
import { computed, ref } from "vue"
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/solid"
import { useInputField, type OptionsInput } from "@/composables/forms"
import InputHelp from "@/lib-components/forms/InputHelp.vue"
import InputError from "@/lib-components/forms/InputError.vue"
import InputLabel from "@/lib-components/forms/InputLabel.vue"

// NOTE(spk): What this doesn't do:
//
// - allow "custom-values" i.e. user supplied values
// - support async options based on query
// - limited support for HTML5 input events
// - grouped options
// - no deselection - it works like a <select />, but is searchable

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<OptionsInput>(), {
  help: "",
  label: "",
  modelValue: undefined,
  placeholder: "Select an option",
})

const modelState = defineModel<OptionsInput["modelValue"]>({
  default: null,
  required: false,
})

const {
  aria,
  errorState,
  inputID,
  isDisabled,
  isRequired,
  nameAttr,
  onInvalid,
  validate,
} = useInputField(props)

const maxOptions = 50

const query = ref("")

const filteredOptions = computed(() => {
  return query.value === ""
    ? props.options
    : props.options.filter((opt) => {
        return (
          opt.label?.toLowerCase().includes(query.value.toLowerCase()) ||
          opt.help?.toLowerCase().includes(query.value.toLowerCase())
        )
      })
})

const renderableOptions = computed(() => {
  return filteredOptions.value.slice(0, maxOptions)
})

const totalOptions = computed(() => {
  return filteredOptions.value.length
})

const selectedOption = computed(() => {
  return props.options.find((opt) => {
    return opt.value === modelState.value
  })
})

const isPaginated = computed(() => {
  return totalOptions.value > maxOptions
})

const onUpdate = (val: unknown) => {
  if (val) {
    query.value = ""
    errorState.value = ""
  }
}

// NOTE(spk): when @headlessui/Combobox is not in multiple mode mousedown
// events that bubble outside the parent are picked up
// by the "outside click" event that closes active modals.
// It's not expected that this event should need to be captured
// outside the component - @mousedown.stop prevents the event from
// bubbling outside the parent.
</script>

<template>
  <div class="xy-combobox relative" @mousedown.stop>
    <Combobox
      v-model="modelState"
      as="div"
      :disabled="isDisabled"
      :name="nameAttr"
      @update:model-value="onUpdate"
    >
      <ComboboxLabel
        v-if="label"
        :id="aria.labelledby"
        :as="InputLabel"
        class="mb-2"
        :label="label"
        :required="isRequired"
      />

      <div
        :class="[
          'relative w-full rounded-md border-0 py-2 pl-3 pr-1.5 shadow-sm ring-1 ring-inset has-[input:focus]:ring-2',
          'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-gray-50 has-[input:disabled]:text-gray-700 has-[input:disabled]:ring-gray-200',
          errorState
            ? 'text-red-900 ring-red-700  has-[input:focus]:ring-red-700'
            : 'text-gray-900 ring-gray-300 has-[input:focus]:ring-xy-blue-500',
        ]"
      >
        <div class="pr-10">
          <ComboboxButton as="div" class="leading-none" aria-hidden>
            <ComboboxInput
              :id="inputID"
              :aria-labelledby="aria.labelledby"
              :aria-describedby="aria.describedby"
              :aria-errormessage="aria.errormessage"
              :class="[
                'xy-combobox-input truncate w-full sm:text-sm sm:leading-6',
                errorState
                  ? 'placeholder:text-red-300'
                  : 'placeholder:text-gray-400',
              ]"
              :disabled="isDisabled"
              :display-value="() => selectedOption?.label || ''"
              :placeholder="placeholder"
              @change="query = $event.target.value"
            />
          </ComboboxButton>
        </div>

        <ComboboxButton
          class="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
        >
          <ChevronUpDownIcon class="h-5 w-5 text-gray-500" aria-hidden="true" />
        </ComboboxButton>
      </div>

      <ComboboxOptions
        class="absolute z-[5] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm scroll-pt-10"
      >
        <li
          v-if="isPaginated"
          class="bg-neutral-100 font-medium border-b border-neutral-200 sticky top-0 py-1.5 px-3 z-[5]"
        >
          Showing {{ renderableOptions.length }} of {{ totalOptions }} results.
        </li>

        <ComboboxOption
          v-for="option in renderableOptions"
          v-slot="{
            active,
            disabled,
            selected,
          }: {
            active: boolean
            disabled: boolean
            selected: boolean
          }"
          :key="option.value"
          :value="option.value"
          :disabled="isDisabled || option.disabled"
        >
          <div
            :class="[
              'relative select-none py-2 pl-8 pr-4',
              active ? 'text-gray-900 bg-neutral-50 outline-none' : '',
              disabled ? 'text-gray-500 cursor-not-allowed' : 'cursor-pointer',
            ]"
          >
            <div>
              <div
                :class="[
                  'block truncate',
                  selected ? 'font-semibold' : 'font-medium',
                ]"
              >
                {{ option.label }}
              </div>
              <div v-if="option.help" class="block truncate">
                {{ option.help }}
              </div>
            </div>

            <span
              v-if="selected"
              class="absolute inset-y-0 left-0 flex items-center pl-1.5 text-xy-blue-500"
            >
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
        </ComboboxOption>
      </ComboboxOptions>
    </Combobox>

    <InputHelp
      v-if="help"
      :id="aria.describedby"
      class="mt-1"
      tag="p"
      :text="help"
    />

    <InputError :id="aria.errormessage" class="mt-1" :text="errorState" />

    <!--Hidden input for validation-->
    <select
      v-model="modelState"
      aria-hidden
      class="sr-only top-1 left-1"
      :disabled="isDisabled"
      :required="isRequired"
      :tabindex="errorState ? undefined : -1"
      @change="validate"
      @invalid="onInvalid"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      />
    </select>
  </div>
</template>
