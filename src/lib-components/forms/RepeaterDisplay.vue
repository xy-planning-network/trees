<script setup lang="ts">
import { computed, ref, useId, useTemplateRef, watch } from "vue"
import { PlusIcon, TrashIcon } from "@heroicons/vue/solid"
import type { RepeaterRow } from "@/composables/useRepeater"
import FormCell from "@/lib-components/forms/FormCell.vue"
import InputError from "@/lib-components/forms/InputError.vue"
import InputHelp from "@/lib-components/forms/InputHelp.vue"
import InputLabel from "@/lib-components/forms/InputLabel.vue"

const props = withDefaults(
  defineProps<{
    type: RepeaterRow["type"]
    title?: string
    help?: string
    count: number
    min?: number
    max?: number
    rows: RepeaterRow[]
    addText?: string
    addDisabled?: boolean
    removeDisabled?: boolean
  }>(),
  {
    title: "",
    help: "",
    min: undefined,
    max: undefined,
    addText: "Add",
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

const isFullWidthField = (row: RepeaterRow) => {
  const span = row.fields[0]?.input.span
  return row.type === "field" && (!span || span === "full")
}

const isRemoveDisabled = (index: number) => {
  const isModelRow = index < props.count
  return props.removeDisabled || (isModelRow && props.count <= (props.min ?? 0))
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
      :class="{
        'rounded-xy border border-neutral-200 p-6': row.type === 'collection',
      }"
    >
      <div
        v-if="row.type === 'collection'"
        class="mb-6 flex items-center justify-between gap-x-4"
      >
        <InputLabel v-if="row.title" tag="div" :label="row.title" />

        <button
          type="button"
          class="xy-btn-neutral-sm ml-auto shrink-0 gap-x-1.5"
          :disabled="isRemoveDisabled(rowIndex)"
          :aria-label="`Remove item ${rowIndex + 1}`"
          @click="emit('remove', rowIndex)"
        >
          <TrashIcon class="h-4 w-4" aria-hidden="true" />
          <span>Remove</span>
        </button>
      </div>

      <div
        v-if="row.type === 'field'"
        :class="
          isFullWidthField(row)
            ? 'flex items-center gap-x-3'
            : 'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 sm:grid-cols-12'
        "
      >
        <template v-for="field in row.fields" :key="field.key">
          <FormCell
            v-if="field.input.show"
            :class="{ 'min-w-0 flex-1': isFullWidthField(row) }"
            :span="field.input.span || 'full'"
            :start="field.input.start"
          >
            <component
              :is="field.input.$component"
              v-bind="field.input.$props"
            />
          </FormCell>
        </template>

        <button
          type="button"
          class="xy-btn-neutral-sm shrink-0 justify-self-start"
          :disabled="isRemoveDisabled(rowIndex)"
          :aria-label="`Remove item ${rowIndex + 1}`"
          @click="emit('remove', rowIndex)"
        >
          <TrashIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div v-else>
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
    </div>

    <button
      type="button"
      class="xy-btn-neutral-sm"
      :disabled="addDisabled"
      @click="emit('add')"
    >
      <PlusIcon class="mr-1.5 h-4 w-4" aria-hidden="true" />
      {{ addText }}
    </button>

    <!-- Participates in native form validation when the repeater is outside its limits. -->
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
