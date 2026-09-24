<script setup lang="ts">
import { computed, ref, useTemplateRef } from "vue"
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue"
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from "@heroicons/vue/solid"
import {
  looseToNumber,
  useInputField,
  type InputOption,
  type MultiChoiceInput,
} from "@/composables/forms"
import DismissableBadge from "@/lib-components/indicators/DismissableBadge.vue"
import InputHelp from "@/lib-components/forms/InputHelp.vue"
import InputError from "@/lib-components/forms/InputError.vue"
import InputLabel from "@/lib-components/forms/InputLabel.vue"

// NOTE(spk): What this doesn't do:
//
// - support async options based on query
// - limited support for HTML5 input events
// - grouped options

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<MultiChoiceInput & { customValues?: boolean }>(),
  {
    customValues: false,
    help: "",
    label: "",
    modelValue: undefined,
    placeholder: "",
  }
)

// NOTE(spk): Our getter method ensures the modelState is always an Array type.
type Getter = Exclude<MultiChoiceInput["modelValue"], null | undefined>
const modelState = defineModel<MultiChoiceInput["modelValue"], never, Getter>({
  default: undefined,
  required: false,

  // NOTE(spk): The Vue.js specific handling of initial prop values null vs undefined
  // means we can't rely on the the "default" param of defineModel here.  Ensuring the
  // getter returns an array type allows for a consistent checkbox v-model binding similar to
  // the example in the official Vue.js docs.
  //
  // When a parent component passes a null v-model the parent ref stays null until
  // a mutation occurs which is consistent with other input components.
  get: (v) => {
    if (!Array.isArray(v)) {
      return []
    }

    return v
  },
  set: (v) => {
    if (!Array.isArray(v)) {
      return v
    }

    // NOTE(spk): assume all number like inputs are meant to be parsed as numbers
    // If this becomes inflexible, add support for v-model modifiers to this input
    // and FieldsSchema
    return v.map((value) => {
      return looseToNumber(value)
    })
  },
})

const { aria, inputID, isDisabled, errorState, nameAttr } = useInputField(props)

const query = ref("")

const selectedOptions = computed((): InputOption[] => {
  // NOTE(spk): custom values in the the modelState can lead to
  // undefined results here, filter them out.
  const opts = modelState.value
    .map((value) => {
      return props.options.find((opt) => opt.value === value)
    })
    .filter((value): value is InputOption => value !== undefined)

  if (props.customValues) {
    const customOpts = modelState.value
      .filter((value) => {
        return !props.options.find((opt) => opt.value === value)
      })
      .map((value) => {
        return {
          label: value.toString(),
          value: value,
          disabled: false,
        }
      })

    return [...customOpts, ...opts]
  }

  return opts
})

const minCount = computed(() => {
  return props.min || null
})

const maxCount = computed(() => {
  return props.max || null
})

const countError = computed(() => {
  const count = modelState.value?.length || 0

  // min not reached, no max is set
  if (minCount.value !== null && count < minCount.value) {
    return `Please select at least ${minCount.value} of these options.`
  }

  // max is reached, no min set
  if (maxCount.value !== null && count > maxCount.value) {
    return `Please limit your selection to ${maxCount.value} of these options.`
  }

  // min and max are both set and at least on of them is out of range
  if (
    minCount.value !== null &&
    maxCount.value !== null &&
    (count < minCount.value || count > maxCount.value)
  ) {
    return `Please select between ${minCount.value} and ${maxCount.value} of these options.`
  }

  return ""
})

const showClearAll = computed(() => {
  return modelState.value.length > 0 && !isDisabled.value
})

const errorInputRef = useTemplateRef("errorInput")
const setValidationError = () => {
  if (!errorState.value) {
    errorState.value = countError.value
    // ensure the browser tooltip contains our error message
    errorInputRef.value?.setCustomValidity(countError.value)
  }
}

const deselect = (value: any) => {
  modelState.value = selectedOptions.value
    .filter((opts) => {
      return opts.value !== value
    })
    .map((opts) => {
      return opts.value
    })
}

const onDeleteKeydown = () => {
  if (query.value) {
    return
  }

  const last = selectedOptions.value.findLast((opt) => opt)
  if (!last) {
    return
  }

  modelState.value = modelState.value.filter((val) => {
    return val !== last.value
  })
}

const onUpdate = (val: unknown) => {
  if (val) {
    query.value = ""
    errorState.value = ""
  }
}

const maxOptions = 50

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
  const opts = filteredOptions.value.slice(0, maxOptions)

  // NOTE(spk): if the query.value is already a "selected" value or
  // is available in the options set, avoid displaying a duplicate option
  if (props.customValues && query.value !== "") {
    const selected = modelState.value.find((v) => v === query.value)
    const exists = props.options.find(
      (v) => v.value === looseToNumber(query.value)
    )

    if (!selected && !exists) {
      opts.unshift({ label: query.value, value: query.value })
    }
  }

  return opts
})

const totalOptions = computed(() => {
  return filteredOptions.value.length
})

const isPaginated = computed(() => {
  return totalOptions.value > maxOptions
})
</script>

<template>
  <div
    class="xy-multiselect relative"
    :aria-labelledby="aria.labelledby"
    :aria-describedby="aria.describedby"
    :aria-errormessage="aria.errormessage"
    role="fieldset"
  >
    <Combobox
      v-model="modelState"
      :disabled="isDisabled"
      :name="nameAttr"
      as="div"
      multiple
      @update:model-value="onUpdate"
    >
      <ComboboxLabel
        v-if="label"
        :id="aria.labelledby"
        :as="InputLabel"
        class="mb-2"
        :label="label"
        :required="minCount ? true : false"
      />

      <div
        :class="[
          'relative w-full rounded-md border-0 py-2 pl-3 shadow-sm ring-1 ring-inset has-[input:focus]:ring-2',
          'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-gray-50 has-[input:disabled]:text-gray-700 has-[input:disabled]:ring-gray-200',
          showClearAll ? 'pr-16' : 'pr-10',
          errorState
            ? 'text-red-900 ring-red-700  has-[input:focus]:ring-red-700'
            : 'text-gray-900 ring-gray-300 has-[input:focus]:ring-xy-blue-500',
        ]"
      >
        <div class="flex flex-wrap gap-y-1.5 items-center justify-start">
          <template v-if="selectedOptions.length > 0">
            <div
              v-for="option in selectedOptions"
              :key="option.value"
              class="shrink-0 pr-1.5 max-w-full"
            >
              <div v-if="isDisabled || option.disabled" class="xy-badge">
                {{ option.label }}
              </div>

              <DismissableBadge
                v-else
                :label="option.label"
                @dismiss="deselect(option.value)"
              />
            </div>
          </template>

          <ComboboxButton as="div" class="flex-1 leading-none">
            <ComboboxInput
              :id="inputID"
              :class="[
                'xy-multiselect-input w-full min-w-8 sm:text-sm sm:leading-6',
                errorState
                  ? 'placeholder:text-red-300'
                  : 'placeholder:text-gray-400',
              ]"
              :disabled="isDisabled"
              :placeholder="modelState.length === 0 ? placeholder : ''"
              :value="query"
              @change="query = $event.target.value"
              @keydown.delete="onDeleteKeydown"
            />
          </ComboboxButton>
        </div>

        <div class="absolute flex inset-y-0 right-0">
          <button
            v-if="showClearAll"
            class="shrink-0 flex items-center rounded-md px-1.5"
            type="button"
            @click="modelState = []"
          >
            <XMarkIcon class="h-4 w-4 text-gray-500" aria-hidden="true" />
          </button>

          <ComboboxButton
            class="shrink-0 flex items-center px-1.5 focus:outline-none"
          >
            <ChevronUpDownIcon
              class="h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
          </ComboboxButton>
        </div>
      </div>

      <ComboboxOptions
        v-if="renderableOptions.length > 0"
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
              active
                ? 'bg-xy-blue-600 font-semibold text-white outline-none'
                : '',
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

    <!--Hidden input for custom validation-->
    <input
      v-if="countError"
      ref="errorInput"
      required
      class="sr-only top-1 left-1"
      aria-hidden
      :tabindex="errorState ? undefined : -1"
      type="checkbox"
      @invalid="setValidationError"
    />
  </div>
</template>
