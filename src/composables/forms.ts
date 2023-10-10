import {
  Ref,
  computed,
  getCurrentInstance,
  onMounted,
  ref,
  useAttrs,
  watch,
} from "vue"
import Uniques from "@/helpers/Uniques"
import { debounce } from "@/helpers/Debounce"

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
  help: "",
  label: "",
  modelValue: undefined, // important to prevent unexpected default value of false
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

export const useInputField = (
  el?: Ref<HTMLInputElement | HTMLInputElement[] | null>,
  props?: Input
) => {
  const modelState = props ? useLocalModel(props, "modelValue") : ref(undefined)
  const errorState = props ? useLocalModel(props, "error") : ref(undefined)
  const targets = el || ref(null)

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

  const onInvalid = (e: Event) => {
    if (e.type !== "invalid") {
      return
    }

    errorState.value = (e.target as HTMLInputElement).validationMessage
  }

  const validate = (e: Event) => {
    if (!errorState.value) {
      return
    }

    // clear custom validation message from targetInput
    targetInput?.value?.setCustomValidity("")

    const target = e.target as HTMLInputElement
    if (!target.checkValidity()) {
      errorState.value = target.validationMessage
    } else {
      errorState.value = ""
    }
  }

  const inputValidation = debounce(validate, 350)

  const targetInput = computed(() => {
    // radios and multicheckboxes have multiple inputs.
    // we only need to target the first input for setting
    // custom error messages
    return Array.isArray(targets.value) ? targets.value[0] : targets.value
  })

  onMounted(() => {
    // watch the props.error and set custom validation messages as needed.
    watch(
      () => props?.error,
      () => {
        targetInput?.value?.setCustomValidity(props?.error || "")

        if (props?.error) {
          targetInput?.value?.reportValidity()
        }
      }
    )

    // report the initial custom error message
    if (errorState.value) {
      targetInput?.value?.setCustomValidity(errorState.value)
      targetInput?.value?.reportValidity()
    }
  })

  // TODO:? when focused, if error - report validity

  return {
    attrs,
    inputID,
    isDisabled,
    isRequired,
    nameAttr,
    modelState,
    errorState,
    onInvalid,
    validate,
    inputValidation,
  }
}

/**
 * email validation regex pattern
 * used with input type="email" in the pattern attribute for html5 validation
 * exported as a raw string to support the escape backslash characters
 */
export const emailPattern = String.raw`^\w+([\-+.']\w+)*@\w+([\-.]\w+)*\.\w+([\-.]\w+)*$`

/**
 * password validation regex pattern
 * used with input type="password" in the pattern attribute for html5 validation
 * exported as a raw string to support the escape backslash characters
 */
export const passwordPattern = String.raw`(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*\(\)_+=\-]).{8,}`

/**
 * phone number validation regex pattern
 * used with input type="tel" in the pattern attribute for html5 validation
 */
export const phonePattern = String.raw`[0-9]{10}|[0-9]{3}-[0-9]{3}-[0-9]{4}`

/**
 * This is used for the .number modifier in v-model
 */
export const looseToNumber = (val: any): any => {
  const n = parseFloat(val)
  return isNaN(n) ? val : n
}

export const useLocalModel = <T extends Record<string, any>, K extends keyof T>(
  props: T,
  name: K
): Ref<T[K]> => {
  const i = getCurrentInstance()!
  const proxy = ref<any>(props[name])

  // keep the local value in sync with the prop value
  watch(
    () => props[name],
    (v) => (proxy.value = v)
  )

  // emit the updated local value to the prop when updated
  watch(proxy, (v) => {
    if (v !== props[name]) {
      i.emit(`update:${String(name)}`, v)
    }
  })

  return proxy
}
