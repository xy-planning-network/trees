<script setup lang="ts">
import { computed, ref, useId, useTemplateRef, watch } from "vue"
import { PlusIcon, TrashIcon } from "@heroicons/vue/solid"
import type {
  ResolvedRepeaterRow,
  ResolvedRepeaterType,
} from "@/composables/useRepeater"
import FormCell from "@/lib-components/forms/FormCell.vue"
import InputError from "@/lib-components/forms/InputError.vue"
import InputHelp from "@/lib-components/forms/InputHelp.vue"
import InputLabel from "@/lib-components/forms/InputLabel.vue"

const props = withDefaults(
  defineProps<{
    type: ResolvedRepeaterType
    title?: string
    help?: string
    count: number
    min?: number
    max?: number
    rows: ResolvedRepeaterRow[]
    addButtonText?: string
    addDisabled?: boolean
    removeDisabled?: boolean
  }>(),
  {
    title: "",
    help: "",
    min: undefined,
    max: undefined,
    addButtonText: "Add",
    addDisabled: false,
    removeDisabled: false,
  }
)

const emit = defineEmits<{
  add: []
  remove: [index: number]
}>()

const validationID = useId()
const errorState = ref("")
const errorInputRef = useTemplateRef<HTMLInputElement>("errorInput")

const countError = computed(() => {
  const belowMin = props.min !== undefined && props.count < props.min
  const aboveMax = props.max !== undefined && props.count > props.max

  if (props.min !== undefined && props.max !== undefined) {
    return belowMin || aboveMax
      ? `Please add between ${props.min} and ${props.max} items.`
      : ""
  }

  if (belowMin) {
    return `Please add at least ${props.min} items.`
  }

  if (aboveMax) {
    return `Please limit this list to ${props.max} items.`
  }

  return ""
})

const setValidationError = () => {
  errorState.value = countError.value
  errorInputRef.value?.setCustomValidity(countError.value)
}

watch(countError, (error) => {
  if (!error) {
    errorInputRef.value?.setCustomValidity("")
    errorState.value = ""
    return
  }

  if (errorState.value) {
    errorState.value = error
    errorInputRef.value?.setCustomValidity(error)
  }
})
</script>

<template>
  <div
    class="relative space-y-6"
    :class="type === 'field' ? 'border-b border-gray-900/10 pb-10' : ''"
    role="group"
    :aria-labelledby="title ? `${validationID}-label` : undefined"
    :aria-describedby="help ? `${validationID}-help` : undefined"
    :aria-errormessage="errorState ? `${validationID}-error` : undefined"
  >
    <div v-if="title || help || errorState">
      <InputLabel :id="`${validationID}-label`" tag="div" :label="title" />
      <InputHelp
        :id="`${validationID}-help`"
        :class="{ 'mt-1': title }"
        :text="help"
      />
      <InputError
        :id="`${validationID}-error`"
        :class="{ 'mt-1': title || help }"
        :text="errorState"
      />
    </div>

    <div
      v-for="(row, rowIndex) in rows"
      :key="row.key"
      class="relative"
      :class="
        row.type === 'collection'
          ? 'rounded-xy border border-neutral-200 p-6'
          : 'flex items-center gap-x-3'
      "
    >
      <div
        v-if="row.type === 'collection'"
        class="mb-6 flex items-center justify-between gap-x-4"
      >
        <InputLabel v-if="row.title" tag="div" :label="row.title" />

        <button
          type="button"
          class="xy-btn-neutral-sm ml-auto shrink-0 gap-x-1.5"
          :disabled="removeDisabled"
          :aria-label="`Remove item ${rowIndex + 1}`"
          @click="emit('remove', rowIndex)"
        >
          <TrashIcon class="h-4 w-4" aria-hidden="true" />
          <span>Remove</span>
        </button>
      </div>

      <div :class="row.type === 'field' ? 'flex-1' : ''">
        <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
          <template v-for="field in row.fields" :key="field.key">
            <FormCell
              v-if="field.input.show"
              :span="field.input.span || 'full'"
              :start="field.input.start"
            >
              <component
                :is="field.input.$component"
                v-bind="field.input.$props"
              />
            </FormCell>
          </template>
        </div>
      </div>

      <button
        v-if="row.type === 'field'"
        type="button"
        class="xy-btn-neutral-sm shrink-0"
        :disabled="removeDisabled"
        :aria-label="`Remove item ${rowIndex + 1}`"
        @click="emit('remove', rowIndex)"
      >
        <TrashIcon class="h-5 w-5" aria-hidden="true" />
      </button>
    </div>

    <button
      type="button"
      class="xy-btn-neutral-sm"
      :disabled="addDisabled"
      @click="emit('add')"
    >
      <PlusIcon class="mr-1.5 h-4 w-4" aria-hidden="true" />
      {{ addButtonText }}
    </button>

    <!-- Screen-reader-only input for native count validation. -->
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
