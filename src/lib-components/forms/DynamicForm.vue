<script setup lang="ts">
import type { ReqMethod } from "@/api/client"
import { useAppFlasher, useBaseAPI } from "@/composables"
import { FormGrid, FormSection, FormCell } from "./FormGrid"
import type { Component } from "vue"
import { computed, ref } from "vue"
import {
  FieldTypes,
  Fields,
  Fieldset,
  isFormSection,
  isTextField,
} from "@/composables/forms"
import {
  BaseInput,
  Checkbox,
  DateRangePicker,
  MultiCheckboxes,
  Radio,
  RadioCards,
  Select,
  TextArea,
  Toggle,
  YesOrNoRadio,
} from "@/lib-components"
import { Field } from "@/composables/forms"

const props = withDefaults(
  defineProps<{
    action: string
    btnText?: string
    columns: 1 | 2
    flashError?: string | false
    flashSuccess?: string | false
    method: ReqMethod
    fields: Fields
  }>(),
  {
    flashError: undefined,
    flashSuccess: "Success!",
    btnText: "Submit",
  }
)

const emit = defineEmits<{
  success: [result: any]
  error: [error: any]
}>()

const { execute, isLoading } = useBaseAPI(props.action, props.method, {
  withDelay: 500,
})

const form = ref<InstanceType<typeof FormGrid> | null>(null)

const submit = () => {
  if (form.value === null) {
    return
  }

  const formValues = Object.fromEntries(
    // @ts-ignore
    new FormData(form.value.$el as HTMLFormElement).entries()
  )

  execute(formValues)
    .then((d) => {
      if (props.flashSuccess !== false) {
        useAppFlasher.success(props.flashSuccess)
      }

      emit("success", d)
    })
    .catch((e) => {
      if (props.flashError !== false && props.flashError === undefined) {
        useAppFlasher.genericError()
      }

      if (props.flashError !== false && typeof props.flashError === "string") {
        useAppFlasher.error(props.flashError)
      }
      emit("error", e)
    })
}

const fieldMap: Record<FieldTypes, Component> = {
  // textLikeInputs
  date: BaseInput,
  "datetime-local": BaseInput,
  email: BaseInput,
  month: BaseInput,
  number: BaseInput,
  password: BaseInput,
  search: BaseInput,
  tel: BaseInput,
  text: BaseInput,
  time: BaseInput,
  url: BaseInput,
  week: BaseInput,

  // Extended Input Types
  "date-range": DateRangePicker,
  checkbox: Checkbox,
  "multi-checkbox": MultiCheckboxes,
  radio: Radio,
  "radio-cards": RadioCards,
  select: Select,
  textarea: TextArea,
  // TODO: (spk) not supported yet.  at minimum needs internal model-value binding.
  // toggle: Toggle,
  "yes-no-radio": YesOrNoRadio,
}

const fieldsets = computed((): Fieldset[] => {
  const fieldsets: Fieldset[] = []

  if (props.fields.length === 0) {
    return fieldsets
  }

  const firstItem = props.fields[0]
  if (!isFormSection(firstItem)) {
    fieldsets.push({
      fields: [],
    })
  }

  props.fields.forEach((entry) => {
    if (isFormSection(entry)) {
      fieldsets.push({ fields: [], ...entry })
    } else {
      // @ts-ignore
      fieldsets[fieldsets.length - 1].fields.push(entry)
    }
  })

  return fieldsets
})

const getFieldAttrs = (field: Field) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { span, start, type, ...rest } = field
  return rest
}
</script>

<template>
  <FormGrid
    ref="form"
    as="form"
    :btn-disabled="isLoading"
    :btn-text="btnText"
    :columns="columns"
    @submit.prevent="submit"
  >
    <template v-for="(fieldset, fieldsetIdx) in fieldsets" :key="fieldsetIdx">
      <FormSection
        :title="fieldset.title || ''"
        :description="fieldset.description || ''"
      >
        <template v-for="(field, idx) in fieldset.fields" :key="idx">
          <FormCell :span="field.span || 'full'" :start="field.start">
            <component
              :is="fieldMap[field.type]"
              v-if="isTextField(field.type)"
              v-bind="getFieldAttrs(field)"
              :type="field.type"
              :model-value="field.modelValue"
            />

            <component
              :is="fieldMap[field.type]"
              v-else
              v-bind="getFieldAttrs(field)"
              :model-value="field.modelValue"
            />
          </FormCell>
        </template>
      </FormSection>
    </template>
  </FormGrid>
</template>
