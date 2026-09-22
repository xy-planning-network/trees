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
 * or simply an Array of FieldsSchemaInput(s)
 */
export type FieldsSchema = Array<FieldSection> | Array<FieldsSchemaInput>

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
  fields: Array<FieldsSchemaInput>
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
const isInputField = (
  field: any
): field is InputField<Input, InputFieldType> => {
  return (
    typeof field === "object" &&
    Object.prototype.hasOwnProperty.call(field, "type") &&
    inputFieldTypes.includes(field.type)
  )
}

/**
 * disableSchemaFields is a utility function for disabling all input fields
 * in a FieldSchema.  Useful for rendering forms as read-only.
 *
 * @param schema FieldsSchema
 * @returns FieldsSchema
 */
export const disableSchemaFields = (schema: FieldsSchema): FieldsSchema => {
  if (isInputsOnlySchema(schema)) {
    return schema.map((input) => {
      return {
        ...input,
        disabled: true,
      }
    })
  }

  return schema.map((section) => {
    return {
      ...section,
      fields: section.fields.map((input) => {
        return { ...input, disabled: true }
      }),
    }
  })
}

/**
 * extractInputs is a utility function for extracting all of the FieldsSchemaInput
 * entries (nested or not) out of a FieldSchema.
 *
 * @param schema FieldsSchema
 * @returns Array<FieldsSchemaInput>
 */
export const extractInputs = (
  schema: FieldsSchema
): Array<FieldsSchemaInput> => {
  if (isInputsOnlySchema(schema)) {
    return schema
  }

  const inputs: Array<FieldsSchemaInput> = []
  schema.forEach((section) => {
    section.fields.forEach((input) => {
      inputs.push(input)
    })
  })

  return inputs
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
  // hydrate the model with any input.modelValue's
  // NOTE(spk): mutating the model ref by individual property avoids
  // triggering onUpdate:model-value during initial render.
  onBeforeMount(() => {
    extractInputs(toValue(schema)).forEach((input) => {
      if (input.modelValue !== undefined) {
        setProperty(model.value, input.name, input.modelValue)
      }
    })
  })

  const updateModel = (name: string, $val: any) => {
    // NOTE(spk): lodash.set appears to mutate the object directly
    // mutate a copy of the model and assign it back to avoid unexpected
    // reactive side effects
    const modelValue = { ...model.value }
    model.value = setProperty(modelValue, name, $val)
  }

  const fieldSections = computed((): FieldSection[] => {
    const fieldSchema = toValue(schema)

    if (fieldSchema.length == 0) {
      return []
    }

    const outputSchema = isInputsOnlySchema(fieldSchema)
      ? [{ fields: fieldSchema }]
      : fieldSchema

    return outputSchema.map((section) => {
      return {
        ...section,
        fields: section.fields.map((input) => {
          // NOTE: (spk) keep the template tidy by using v-bind="$props"
          // where $props are the "safe" html attributes and expected props
          // for an input component.  Passing all properties will cause noise from vue
          // and potentially lead to a unexpected runtime error.

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
           * NOTE: (spk) text and number inputs require the type property,
           * non-text input types already have an explicit type attribute
           * which should never be overwritten or nullified.
           */
          const hasTypeAttribute =
            isTextInputType(type) || isNumericInputType(type)

          const inputProps = {
            ...props,
            ...(hasTypeAttribute ? { type: input.type } : {}),
            modelValue: getProperty(
              toValue(model.value),
              input.name,
              undefined
            ),
            "onUpdate:model-value": (val: any) => updateModel(input.name, val),
          }

          return {
            ...input,
            $component: inputComponentMap[type],
            $props: inputProps,
            show: typeof show === "boolean" ? show : true,
          }
        }),
      }
    })
  })

  return { fieldSections }
}
