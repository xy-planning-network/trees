<script setup lang="ts">
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue"
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/solid"
import { isHttpCancel } from "@/api/base"
import type { TrailsRespPaged } from "@/api/client"
import {
  useInputField,
  type APIComboBoxInput,
  type InputOption,
} from "@/composables/forms"
import { useBaseAPIGet } from "@/composables/useBaseAPI"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import InputLabel from "./InputLabel.vue"
import { computed, onBeforeUnmount, ref, watch } from "vue"

// NOTE(spk): What this doesn't do:
//
// - allow "custom-values" i.e. user supplied values
// - limited support for HTML5 input events
// - grouped options
// - no deselection - it works like a <select />, but is searchable

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<APIComboBoxInput>(), {
  help: "",
  label: "",
  modelValue: undefined,
  placeholder: "Search for an option",
})

const modelState = defineModel<APIComboBoxInput["modelValue"]>({
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

const minSearchLength = 3
const debounceWait = 300

const apiOptions = ref<InputOption[]>([])
const selectedApiOption = ref<InputOption | null>(null)
const query = ref("")
const isPendingSearch = ref(false)

const {
  abort,
  error: fetchError,
  execute,
  isAborted,
  isLoading,
} = useBaseAPIGet<TrailsRespPaged<any>>(() => props.url, {
  skipLoader: true,
})

const normalizedQuery = computed(() => {
  return query.value.trim()
})

const queryParams = computed(() => {
  // NOTE(jlt): hardcodes max of 50 results.
  // Headless suffers from a performance issue when rendering too many options.
  // Forcing the options set to 50 here assuming the server will comply.
  return {
    page: 1,
    perPage: 50,
    q: normalizedQuery.value,
  }
})

const hasMinSearchLength = computed(() => {
  return normalizedQuery.value.length >= minSearchLength
})

const isSearching = computed(() => {
  return isPendingSearch.value || isLoading.value
})

const hasFetchError = computed(() => {
  return fetchError.value !== undefined && !isAborted.value
})

const availableOptions = computed(() => {
  const options = new Map<InputOption["value"], InputOption>()

  if (selectedApiOption.value) {
    options.set(selectedApiOption.value.value, selectedApiOption.value)
  }

  apiOptions.value.forEach((option) => {
    options.set(option.value, option)
  })

  return Array.from(options.values())
})

const selectedOption = computed(() => {
  return availableOptions.value.find((opt) => {
    return opt.value === modelState.value
  })
})

const hasUnmappedModelValue = computed(() => {
  return (
    modelState.value !== null &&
    modelState.value !== undefined &&
    modelState.value !== "" &&
    !selectedOption.value
  )
})

const statusMessage = computed(() => {
  if (!hasMinSearchLength.value) {
    return `Enter at least ${minSearchLength} characters to search.`
  }

  if (isSearching.value) {
    return "Searching..."
  }

  if (hasFetchError.value) {
    return "Unable to load results."
  }

  if (
    query.value !== "" &&
    hasMinSearchLength.value &&
    availableOptions.value.length === 0
  ) {
    return "No results found."
  }

  return ""
})

const clearSearch = () => {
  clearTimeout(searchTimer)
  abort()
  apiOptions.value = []
  fetchError.value = undefined
  isPendingSearch.value = false
}

const fetchOptions = () => {
  if (!hasMinSearchLength.value) {
    return
  }

  const requestedQuery = normalizedQuery.value

  abort()

  execute(queryParams.value)
    .then((result) => {
      if (requestedQuery !== normalizedQuery.value) {
        return
      }

      apiOptions.value = result.data.items.map(props.optionMapper)
    })
    .catch((err) => {
      if (isHttpCancel(err) || requestedQuery !== normalizedQuery.value) {
        return
      }

      apiOptions.value = []
    })
    .finally(() => {
      if (requestedQuery === normalizedQuery.value) {
        isPendingSearch.value = false
      }
    })
}

let searchTimer: ReturnType<typeof setTimeout> | undefined
const debouncedFetchOptions = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(fetchOptions, debounceWait)
}

const onUpdate = (val: unknown) => {
  if (val !== null && val !== undefined) {
    selectedApiOption.value =
      availableOptions.value.find((opt) => opt.value === val) || null
    query.value = ""
    errorState.value = ""
  }
}

watch(normalizedQuery, () => {
  fetchError.value = undefined

  if (!hasMinSearchLength.value) {
    clearSearch()
    return
  }

  apiOptions.value = []
  isPendingSearch.value = true
  debouncedFetchOptions()
})

watch(
  () => props.url,
  () => {
    clearSearch()
    selectedApiOption.value = null
    query.value = ""
  }
)

onBeforeUnmount(() => {
  clearTimeout(searchTimer)
  abort()
})

// NOTE(spk): when @headlessui/Combobox is not in multiple mode mousedown
// events that bubble outside the parent are picked up
// by the "outside click" event that closes active modals.
// It's not expected that this event should need to be captured
// outside the component - @mousedown.stop prevents the event from
// bubbling outside the parent.
</script>

<template>
  <div class="xy-api-combobox relative" @mousedown.stop>
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
          'has-[input:disabled]:cursor-not-allowed has-[input:disabled]:bg-gray-100 has-[input:disabled]:text-gray-500 has-[input:disabled]:ring-gray-200 has-[input:disabled]:shadow-none has-[input:disabled]:opacity-75',
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
                'disabled:cursor-not-allowed disabled:text-gray-500 disabled:placeholder:text-gray-300',
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
          class="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none disabled:cursor-not-allowed"
        >
          <ChevronUpDownIcon
            :class="['h-5 w-5', isDisabled ? 'text-gray-300' : 'text-gray-500']"
            aria-hidden="true"
          />
        </ComboboxButton>
      </div>

      <ComboboxOptions
        class="absolute z-[5] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm scroll-pt-10"
      >
        <li v-if="statusMessage" class="py-2 px-3 text-gray-500">
          {{ statusMessage }}
        </li>

        <ComboboxOption
          v-for="option in availableOptions"
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
        v-for="option in availableOptions"
        :key="option.value"
        :value="option.value"
      />
      <option v-if="hasUnmappedModelValue" :value="modelState" />
    </select>
  </div>
</template>

<style lang="postcss">
.xy-api-combobox .xy-combobox-input {
  @apply shadow-none border-none bg-transparent focus:ring-0 p-0;
}
</style>
