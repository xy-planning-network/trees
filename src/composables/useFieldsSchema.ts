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
import { useRepeater } from "@/composables/useRepeater"
import getProperty from "@/helpers/GetProperty"
import setProperty from "@/helpers/SetProperty"
import BaseInput from "@/lib-components/forms/BaseInput.vue"
import ComboBox from "@/lib-components/forms/Combobox.vue"
import Checkbox from "@/lib-components/forms/Checkbox.vue"
import DateRangePicker from "@/lib-components/forms/DateRangePicker.vue"
import DateTime from "@/lib-components/forms/DateTimeInput.vue"
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
 * or simply an Array of FieldsSchemaField(s)
 */
export type FieldsSchema = Array<FieldSection> | Array<FieldsSchemaField>

/**
 * FieldsSchemaInput type declares the supported input components in a FieldsSchema
 */
export type FieldsSchemaInput =
  | InputField<BooleanInput, "checkbox" | "toggle" | "yes-no-radio">
  | InputField<MultiChoiceInput, "multi-checkbox">
  | InputField<MultiChoiceInput & { customValues?: boolean }, "multi-select">
  | InputField<DateRangeInput, "date-range">
  | InputField<DateTimeInput, "datetime">
  | InputField<NumericInput, NumericInputType>
  | InputField<OptionsInput, "combobox" | "radio" | "radio-cards" | "select">
  | InputField<TextareaInput, "textarea">
  | InputField<TextLikeInput, Exclude<TextInputType, "number">>

/**
 * Omits repeater-managed properties from each FieldsSchemaInput variant
 * individually, preserving type-specific requirements such as `options`.
 * Using Omit directly on the union would weaken that type checking.
 */
type RepeaterSchemaInput<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, Extract<keyof T, K>>
  : never

/**
 * A scalar repeater input is an ordinary input declaration whose name and
 * model value are owned by the containing repeater.
 */
export type RepeaterFieldInput = RepeaterSchemaInput<
  FieldsSchemaInput,
  "name" | "modelValue" | "$component" | "$props"
>

/**
 * Collection field names are relative to their containing repeater item.
 * Initial collection data belongs on the repeater's modelValue rather than on
 * individual field templates.
 */
export type RepeaterCollectionInput = RepeaterSchemaInput<
  FieldsSchemaInput,
  "modelValue" | "$component" | "$props"
>

export type RepeaterIndexPosition = "prefix" | "suffix"

export interface RepeaterFieldBase<T> {
  type: "repeater"
  name: string
  modelValue?: T[]
  title?: string
  help?: string
  indexPosition?: RepeaterIndexPosition
  /**
   * Bounds control rendered rows, Add/Remove actions, and native array-length
   * validation. Existing model arrays are always rendered as supplied and are
   * never normalized to these bounds.
   */
  min?: number
  max?: number
  addButtonText?: string
  disabled?: boolean
  span?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  start?: boolean
  show?: boolean

  // These properties are added when the schema is resolved for rendering.
  $component?: Component
  $props?: Record<string, any>
}

/**
 * Repeats one input and maps its values to a primitive array.
 *
 * @example
 * {
 *   type: "repeater",
 *   name: "phone_numbers",
 *   title: "Phone numbers",
 *   help: "Add each number where you can be reached.",
 *   indexPosition: "suffix",
 *   addButtonText: "Add phone number",
 *   field: { type: "tel", label: "Phone number" }
 * }
 */
export interface RepeaterField extends RepeaterFieldBase<unknown> {
  field: RepeaterFieldInput
  fields?: never
}

/**
 * Repeats a collection of relatively named inputs and maps each collection to
 * an object in the resulting array. Nested repeaters are intentionally not
 * supported in this initial interface.
 *
 * @example
 * {
 *   type: "repeater",
 *   name: "household_members",
 *   title: "Household members",
 *   itemTitle: "Household member",
 *   help: "Include everyone who lives in your household.",
 *   indexPosition: "prefix",
 *   min: 1,
 *   fields: [
 *     { type: "text", name: "name", label: "Name" },
 *     { type: "number", name: "age", label: "Age" }
 *   ]
 * }
 */
export interface RepeaterFieldCollection
  extends RepeaterFieldBase<Record<string, any>> {
  field?: never
  itemTitle?: string
  fields: RepeaterCollectionInput[]
}

export type FieldsSchemaRepeater = RepeaterField | RepeaterFieldCollection
export type FieldsSchemaField = FieldsSchemaInput | FieldsSchemaRepeater

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
  fields: Array<FieldsSchemaField>
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

  // NOTE(spk): only used when rendering component, will be overwritten by render components.
  // FIXME (spk): Ideally, these is not part of the interface.
  $component?: Component
  $props?: Record<string, any>
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

/**
 * Determines whether a schema field is a scalar repeater.
 */
export const isRepeaterField = (field: any): field is RepeaterField => {
  return (
    typeof field === "object" &&
    field !== null &&
    field.type === "repeater" &&
    Object.prototype.hasOwnProperty.call(field, "field") &&
    !Object.prototype.hasOwnProperty.call(field, "fields")
  )
}

/**
 * Determines whether a schema field is a repeater collection.
 */
export const isRepeaterFieldCollection = (
  field: any
): field is RepeaterFieldCollection => {
  return (
    typeof field === "object" &&
    field !== null &&
    field.type === "repeater" &&
    Object.prototype.hasOwnProperty.call(field, "fields") &&
    !Object.prototype.hasOwnProperty.call(field, "field")
  )
}

const isSchemaField = (field: any): field is FieldsSchemaField => {
  return (
    isInputField(field) ||
    isRepeaterField(field) ||
    isRepeaterFieldCollection(field)
  )
}

/**
 * Narrows an unsectioned schema containing ordinary inputs and/or repeaters.
 */
export const isFieldsOnlySchema = (
  schema: FieldsSchema
): schema is FieldsSchemaField[] => {
  return schema.length === 0 || schema.every(isSchemaField)
}

const schemaFields = (schema: FieldsSchema): FieldsSchemaField[] => {
  if (isFieldsOnlySchema(schema)) {
    return schema
  }

  return schema.flatMap((section) => section.fields)
}

const disableSchemaField = (field: FieldsSchemaField): FieldsSchemaField => {
  if (isInputField(field)) {
    return { ...field, disabled: true }
  }

  if (isRepeaterField(field)) {
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
): { fieldSections: ComputedRef<FieldSection[]> } => {
  const updateModel = (name: string, $val: any) => {
    model.value = setProperty(model.value, name, $val)
  }

  const resolveInput = (
    input: FieldsSchemaInput,
    onUpdate: ($val: any) => void = ($val) => updateModel(input.name, $val)
  ): FieldsSchemaInput => {
    // Keep the template tidy by passing only safe HTML attributes and expected
    // component props through $props.
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars */
      modelValue,
      show,
      span,
      start,
      type,
      ...props
    } = input

    /**
     * Text and number inputs require the type property. Non-text input types
     * have an explicit type attribute which should not be overwritten.
     */
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

  const { resolveRepeater } = useRepeater(model, resolveInput)

  // Hydrate the model with declared modelValue defaults and emit one update.
  // Repeater templates are deliberately excluded: only the repeater itself
  // owns an initial array value.
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

  const fieldSections = computed((): FieldSection[] => {
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
            ? resolveInput(field)
            : resolveRepeater(field)
        }),
      }
    })
  })

  return { fieldSections }
}
