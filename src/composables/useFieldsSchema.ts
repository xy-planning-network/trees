import {
  Component,
  ComputedRef,
  MaybeRefOrGetter,
  Ref,
  computed,
  onBeforeMount,
  toValue,
} from "vue"
import {
  type BooleanInput,
  type DateRangeInput,
  type FileUploadInput,
  type Input,
  type MultiChoiceInput,
  type OptionsInput,
  type TextInputType,
  type TextLikeInput,
  type TextareaInput,
  type DateTimeInput,
  type NumericInput,
  type NumericInputType,
  numericInputTypes,
  textInputTypes,
} from "@/composables/forms"
import {
  isCollectionRepeater,
  isFieldRepeater,
  useRepeater,
  type DisplayRepeater,
  type Repeater,
} from "@/composables/useRepeater"
import getProperty from "@/helpers/GetProperty"
import setProperty from "@/helpers/SetProperty"
import BaseInput from "@/lib-components/forms/BaseInput.vue"
import ComboBox from "@/lib-components/forms/Combobox.vue"
import Checkbox from "@/lib-components/forms/Checkbox.vue"
import DateRangePicker from "@/lib-components/forms/DateRangePicker.vue"
import DateTime from "@/lib-components/forms/DateTimeInput.vue"
import FileUpload from "@/lib-components/forms/FileUpload.vue"
import MultiCheckboxes from "@/lib-components/forms/MultiCheckboxes.vue"
import MultiSelect from "@/lib-components/forms/MultiSelect.vue"
import NumberInput from "@/lib-components/forms/NumberInput.vue"
import Radio from "@/lib-components/forms/Radio.vue"
import RadioCards from "@/lib-components/forms/RadioCards.vue"
import Select from "@/lib-components/forms/Select.vue"
import TextArea from "@/lib-components/forms/TextArea.vue"
import Toggle from "@/lib-components/forms/Toggle.vue"
import YesOrNoRadio from "@/lib-components/forms/YesOrNoRadio.vue"

/**
 * FieldsSchema supports an Array of FieldSection(s)
 * or simply an Array of SchemaField(s)
 */
export type FieldsSchema = Array<FieldSection> | Array<SchemaField>

/**
 * FieldsSchemaInput type declares the supported input components in a FieldsSchema
 */
export type FieldsSchemaInput =
  | InputField<BooleanInput, "checkbox" | "toggle" | "yes-no-radio">
  | InputField<MultiChoiceInput, "multi-checkbox">
  | InputField<MultiChoiceInput & { customValues?: boolean }, "multi-select">
  | InputField<DateRangeInput, "date-range">
  | InputField<DateTimeInput, "datetime">
  | InputField<FileUploadInput, "file-upload">
  | InputField<NumericInput, NumericInputType>
  | InputField<OptionsInput, "combobox" | "radio" | "radio-cards" | "select">
  | InputField<TextareaInput, "textarea">
  | InputField<TextLikeInput, Exclude<TextInputType, "number">>

/** An input with the component properties needed for display. */
export type DisplayInput = FieldsSchemaInput & {
  $component: Component
  $props: Record<string, any>
  show: boolean
}
export type SchemaField = FieldsSchemaInput | Repeater

/**
 * isTextInputType is a user defined type guard for
 * narrowing if a FieldsSchemaInput in a FieldsSchema is a text
 * like type, ex: input type="text | date | url..."
 *
 * @param type string
 * @returns boolean
 */
export const isTextInputType = (type: string): type is TextInputType => {
  return textInputTypes.includes(type as TextInputType)
}

/**
 * isNumericInputType is a user defined type guard for
 * narrowing if a FieldsSchemaInput in a FieldsSchema is a numeric
 * like type, ex: input type="money | number..."
 *
 * @param type string
 * @returns boolean
 */
export const isNumericInputType = (type: string): type is NumericInputType => {
  return numericInputTypes.includes(type as NumericInputType)
}

/**
 * isInputsOnlySchema is a user defined type guard for narrowing that
 * a FieldsSchema is only made up of FieldsSchemaInputs
 *
 * @param s FieldsSchema
 * @returns boolean
 */
export const isInputsOnlySchema = (
  s: FieldsSchema
): s is Array<FieldsSchemaInput> => {
  if (s.length === 0) {
    return true
  }

  let onlyInputs = true
  s.forEach((u) => {
    if (!isInputField(u)) {
      onlyInputs = false
    }
  })

  return onlyInputs
}

/**
 * A FieldSection maps a grouping of inputs in a FieldsSchema
 * to a FormSection in the FormGrid component.
 */
export interface FieldSection {
  title?: string
  description?: string
  fields: Array<SchemaField>
}

export type DisplayField = DisplayInput | DisplayRepeater
export type DisplaySection = Omit<FieldSection, "fields"> & {
  fields: DisplayField[]
}

// All currently supported input types in the FieldsSchema
// used in the "type" property of a FieldsSchemaInput
export type InputFieldType = (typeof inputFieldTypes)[number]
export const inputFieldTypes = [
  ...textInputTypes,
  ...numericInputTypes,
  "checkbox",
  "combobox",
  "date-range",
  "datetime",
  "file-upload",
  "multi-checkbox",
  "multi-select",
  "radio",
  "radio-cards",
  "select",
  "textarea",
  "toggle",
  "yes-no-radio",
] as const

/**
 * InputField is the type used to declare an option of FieldsSchemaInput
 * The Input interface is enforced against the InputFieldType to avoid applying unsupported
 * modelValues on the input as well as ensure required props are available for the InputFieldType.
 */
export type InputField<I extends Input, T extends InputFieldType> = I & {
  type: T
  name: string // use dot.separated for nested values ex: "nested.field" = {nested: { field: "" }}

  // layout features
  // NOTE: columns is exclusive to input components that support the ColumnedInput interface
  columns?: 2 | 3
  span?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  start?: boolean
  show?: boolean

  // HTML input attributes
  // NOTE: all attributes are passed to every input, but the underlying
  // HTML input or the wrapping component must support it for validation purposes
  disabled?: boolean
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#values
  autocomplete?: string
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation
  min?: number | string
  max?: number | string
  minlength?: number
  maxlength?: number
  pattern?: string
  required?: boolean
}

/**
 * isInputField is a user defined type guard for narrowing an
 * argument is a InputField<Input, InputFieldType>
 *
 * @param field any
 * @returns boolean
 */
const isInputField = (field: any): field is FieldsSchemaInput => {
  return (
    typeof field === "object" &&
    field !== null &&
    Object.prototype.hasOwnProperty.call(field, "type") &&
    inputFieldTypes.includes(field.type)
  )
}

const isSchemaField = (field: any): field is SchemaField => {
  return (
    isInputField(field) || isFieldRepeater(field) || isCollectionRepeater(field)
  )
}

/**
 * Narrows an unsectioned schema containing ordinary inputs and/or repeaters.
 */
export const isFieldsOnlySchema = (
  schema: FieldsSchema
): schema is SchemaField[] => {
  return schema.length === 0 || schema.every(isSchemaField)
}

const schemaFields = (schema: FieldsSchema): SchemaField[] => {
  if (isFieldsOnlySchema(schema)) {
    return schema
  }

  return schema.flatMap((section) => section.fields)
}

const disableSchemaField = (field: SchemaField): SchemaField => {
  if (isInputField(field)) {
    return { ...field, disabled: true }
  }

  if (isFieldRepeater(field)) {
    return {
      ...field,
      disabled: true,
      field: { ...field.field, disabled: true },
    }
  }

  return {
    ...field,
    disabled: true,
    fields: field.fields.map((input) => ({ ...input, disabled: true })),
  }
}

/**
 * disableSchemaFields is a utility function for disabling all input fields
 * in a FieldSchema.  Useful for rendering forms as read-only.
 *
 * @param schema FieldsSchema
 * @returns FieldsSchema
 */
export const disableSchemaFields = (schema: FieldsSchema): FieldsSchema => {
  if (isFieldsOnlySchema(schema)) {
    return schema.map(disableSchemaField)
  }

  return schema.map((section) => {
    return {
      ...section,
      fields: section.fields.map(disableSchemaField),
    }
  })
}

/**
 * extractInputs is a utility function for extracting all directly bound
 * FieldsSchemaInput entries out of a FieldSchema. Repeater templates are
 * skipped because their names are incomplete or relative until rendered.
 *
 * @param schema FieldsSchema
 * @returns Array<FieldsSchemaInput>
 */
export const extractInputs = (
  schema: FieldsSchema
): Array<FieldsSchemaInput> => {
  return schemaFields(schema).filter(isInputField)
}

/**
 * inputComponentMap contains the component reference for each input by type
 * where type is the key and the component is the value.
 *
 * NOTE(spk): A public api for adding to the component map could enable
 * BYOI - Bring Your Own Input
 */
const inputComponentMap: Record<InputFieldType, Component> = {
  // textLikeInputs
  date: BaseInput,
  email: BaseInput,
  month: BaseInput,
  password: BaseInput,
  search: BaseInput,
  tel: BaseInput,
  text: BaseInput,
  time: BaseInput,
  url: BaseInput,
  week: BaseInput,

  // numericInputs
  money: NumberInput,
  number: NumberInput,
  "raw-number": NumberInput,

  // Extended Input Types
  checkbox: Checkbox,
  combobox: ComboBox,
  "date-range": DateRangePicker,
  datetime: DateTime,
  "file-upload": FileUpload,
  "multi-checkbox": MultiCheckboxes,
  "multi-select": MultiSelect,
  radio: Radio,
  "radio-cards": RadioCards,
  select: Select,
  textarea: TextArea,
  "yes-no-radio": YesOrNoRadio,
  toggle: Toggle,
}

/**
 * useFieldsSchema computes the FieldSections of a FieldSchema and tracks
 * input values on the model passed as the first argument.  This encapsulates
 * the necessary logic for maintaining input reactivity for use in form
 * @param model Ref<Record<string, any>
 * @param schema MaybeRefOrGetter<FieldsSchema>
 * @returns { fieldSections: ComputedRef<FieldSection[]> }
 */
export const useFieldsSchema = (
  model: Ref<Record<string, any>>,
  schema: MaybeRefOrGetter<FieldsSchema>
): { fieldSections: ComputedRef<DisplaySection[]> } => {
  const updateModel = (name: string, $val: any) => {
    model.value = setProperty(model.value, name, $val)
  }

  const toDisplayInput = (
    input: FieldsSchemaInput,
    onUpdate: ($val: any) => void = ($val) => updateModel(input.name, $val)
  ): DisplayInput => {
    // Pass only component props and supported HTML attributes through v-bind.
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      modelValue,
      show,
      span,
      start,
      type,
      ...props
    } = input

    // Text and number components still need their native input type. Other
    // components provide their own type.
    const hasTypeAttribute = isTextInputType(type) || isNumericInputType(type)

    const inputProps = {
      ...props,
      ...(hasTypeAttribute ? { type: input.type } : {}),
      modelValue: getProperty(model.value, input.name, undefined),
      "onUpdate:model-value": onUpdate,
    }

    return {
      ...input,
      $component: inputComponentMap[type],
      $props: inputProps,
      show: typeof show === "boolean" ? show : true,
    }
  }

  const { toDisplayRepeater } = useRepeater(model, toDisplayInput)

  // Apply schema defaults once before display. Repeater input templates do not
  // own values; the repeater model owns the full array.
  onBeforeMount(() => {
    let hydrated = model.value

    for (const field of schemaFields(toValue(schema))) {
      if (field.modelValue !== undefined) {
        hydrated = setProperty(hydrated, field.name, field.modelValue)
      }
    }

    if (hydrated !== model.value) {
      model.value = hydrated
    }
  })

  const fieldSections = computed((): DisplaySection[] => {
    const fieldSchema = toValue(schema)

    if (fieldSchema.length == 0) {
      return []
    }

    const outputSchema = isFieldsOnlySchema(fieldSchema)
      ? [{ fields: fieldSchema }]
      : fieldSchema

    return outputSchema.map((section) => {
      return {
        ...section,
        fields: section.fields.map((field) => {
          return isInputField(field)
            ? toDisplayInput(field)
            : toDisplayRepeater(field)
        }),
      }
    })
  })

  return { fieldSections }
}
