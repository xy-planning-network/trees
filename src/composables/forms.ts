import { computed, useAttrs } from "vue"
import Uniques from "@/helpers/Uniques"

export interface Input {
  modelValue?: any
  error?: string
  label?: string
  help?: string
  placeholder?: string
}

export interface InputOption {
  disabled?: boolean
  help?: string
  label: string
  sublabel?: string
  value: string | number
}

export interface BooleanInput extends Input {
  modelValue?: boolean | null
}

export interface DateRangeInput extends Input {
  modelValue?: {
    minDate: number
    maxDate: number
  }
  maxRange?: number
  startDate?: number
}

export interface TextLikeInput extends Input {
  modelValue?: string | number | null
  type: TextInputType
}

export interface TextareaInput extends Input {
  modelValue?: string | number | null
}

export interface OptionsInput extends Input {
  modelValue?: string | number | null
  options: InputOption[]
}

export interface MultiChoiceInput extends Input {
  modelValue?: (string | number)[] | null
  options: InputOption[]
}

export interface ColumnedInput {
  columns?: 2 | 3
}

export const defaultInputProps = {
  error: "",
  label: "",
  help: "",
  placeholder: "",
}

export type TextInputType =
  | "date"
  | "datetime-local"
  | "email"
  | "month"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week"

export const useInputField = () => {
  const attrs = useAttrs()

  const hasAttribute = (attribute: string) => {
    return (
      attrs[attribute] !== undefined &&
      attrs[attribute] !== null &&
      attrs[attribute] !== false &&
      attrs[attribute] !== 0
    )
  }

  const inputID = computed(() => {
    return (attrs.id as string) || Uniques.CreateIdAttribute()
  })

  const isDisabled = computed(() => {
    return hasAttribute("disabled")
  })

  const isRequired = computed(() => {
    return hasAttribute("required")
  })

  const nameAttr = computed(() => {
    return typeof attrs.name === "string" && attrs.name !== ""
      ? attrs.name
      : inputID.value
  })

  return {
    attrs,
    inputID,
    isDisabled,
    isRequired,
    nameAttr,
  }
}
