export type FieldComponent =
  | "BaseInput"
  | "Checkbox"
  | "DateRangePicker"
  | "InputHelp"
  | "InputLabel"
  | "FieldsetLegend"
  | "MultiCheckboxes"
  | "Radio"
  | "RadioCards"
  | "Select"
  | "TextArea"
  | "Toggle"
  | "YesOrNoRadio"

export interface Fields {
  date: FieldComponent
  "date-range": FieldComponent
  "datetime-local": FieldComponent
  email: FieldComponent
  month: FieldComponent
  number: FieldComponent
  password: FieldComponent
  search: FieldComponent
  tel: FieldComponent
  text: FieldComponent
  time: FieldComponent
  url: FieldComponent
  week: FieldComponent
  checkbox: FieldComponent
  "multi-checkbox": FieldComponent
  radio: FieldComponent
  "radio-cards": FieldComponent
  select: FieldComponent
  textarea: FieldComponent
  toggle: FieldComponent
  "yes-no-radio": FieldComponent
}

export type FieldType = Required<keyof Fields>

export const FieldMap: Record<keyof Fields, FieldComponent> = {
  date: "BaseInput",
  "date-range": "DateRangePicker",
  "datetime-local": "BaseInput",
  email: "BaseInput",
  month: "BaseInput",
  number: "BaseInput",
  password: "BaseInput",
  search: "BaseInput",
  tel: "BaseInput",
  text: "BaseInput",
  time: "BaseInput",
  url: "BaseInput",
  week: "BaseInput",
  checkbox: "Checkbox",
  "multi-checkbox": "MultiCheckboxes",
  radio: "Radio",
  "radio-cards": "RadioCards",
  select: "Select",
  textarea: "TextArea",
  toggle: "Toggle",
  "yes-no-radio": "YesOrNoRadio",
}

type RadioCard = {
  disabled?: boolean
  help?: string
  label: string
  sublabel?: string
  value: string | number
}

// TODO:
// - [ ] consolidate props accross fields types to be as close as possible (ex: label vs legend, options, modelValue etc.)
// - [ ] should modelValue actually be required on our fields?
// - [ ] consider layout keys - some fields have a columns prop already, and we'd like to support some kind of column layout for the field itself inside a form
// - [ ] should any field inheritAttributes? - should any component?
// - [ ] is it time for all fields to have a wrapper div?
// - [ ] may need useSafeAttributes composable which returns a filtered object of defined attributes you want to allow with useAttributes
//////// - see Select, BaseInput, where value is being set again (may just need to consider order of v-bind merging of attributes)
// - [ ] gather all existing HTML Input attributes and merge with input props - may be best to define individually (per input component)
// - [ ] deterine the difference between name and id attributes on form fields and how they are used in formData
// - [ ] do we need a hidden type?  may be helpful for server side derived forms?

export interface Field {
  columns?: 2 | 3
  disabled?: boolean
  help?: string
  label?: string
  legend?: string
  name: string
  options?: { label: string; value: string | number }[] | RadioCard[]
  placeholder?: string
  required?: boolean
  type: FieldType
  value: any
}
