import { computed, ref, useAttrs, useId } from "vue"
import { debounce } from "@/helpers/Debounce"

export interface Input {
  modelValue?: any
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

export interface DateTimeInput extends Input {
  modelValue?: string | null
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
  max?: number
  min?: number
  modelValue?: (string | number)[] | null
  options: InputOption[]
}

export interface ColumnedInput {
  columns?: 2 | 3
}

export const defaultInputProps = {
  help: "",
  label: "",
  modelValue: undefined,
  placeholder: "",
}

/**
 * Form inputs follow an option v-model pattern to allow input field usage
 * where tracking the input binding directly is not necessary.
 *
 * ex: a required checkbox as a confirmation for submitting a form.
 *
 * NOTE(spk): we prevent unexpected default v-model values of a
 * literal 'false' due to an unset v-model prop.
 *
 * see: https://github.com/vuejs/vue/issues/4792#issuecomment-275396426
 */
export const defaultModelOpts = {
  default: undefined,
  required: false,
}

export const textInputTypes = [
  "date",
  "email",
  "month",
  "number",
  "password",
  "search",
  "tel",
  "text",
  "time",
  "url",
  "week",
] as const

export type TextInputType = (typeof textInputTypes)[number]

/**
 * useInputField provides a number of computed values, refs, and methods to support
 * wiring up reactive inputs.
 *
 * @param config UseInputFieldConfig
 */
export const useInputField = <T extends Input>(props: T) => {
  // The fallthrough attributes received on the component.
  // This is used to simplify input prop management and let's common HTMLInputElement
  // attributes be set on the component with the expectation that it will function as though
  // it was a plain old HTMLInputElement.  ex: required, disabled
  const attrs = useAttrs()

  // The errorState is used to set the default HTMLInputElement validation message in the onInvalid method.
  const errorState = ref<string>("")

  /**
   * inputID computes the id attribute for a input
   * the id attribute should always be unique in the DOM
   * and when the id attribute is not explicity set a unique value
   * is created.  This primarily aids in setting accessibility attributes.
   */
  const defaultIDAttr = useId()
  const inputID = computed(() => {
    return (attrs.id as string) || defaultIDAttr
  })

  /**
   * isDisabled determines if the input field has the disabled attribute
   */
  const isDisabled = computed(() => {
    return hasAttribute(attrs, "disabled")
  })

  /**
   * isRequired determines if the input field has the required attribute
   */
  const isRequired = computed(() => {
    return hasAttribute(attrs, "required")
  })

  /**
   * nameAttr computes the name attribute that should be set on the the input.
   */
  const nameAttr = computed(() => {
    return typeof attrs.name === "string" && attrs.name !== ""
      ? attrs.name
      : inputID.value
  })

  /**
   * aria computes commonly used aria attributes used on form inputs.
   * labelledby, describedby, and errormessage are set with a value that
   * should be used as the id attribute for the HTMLElement that fullfills
   * the aria attributes purpose.
   *
   * ex:
   * <label :id="aria.labelledby">My Input</label>
   * <input :aria-labelledby="aria.labelledby" />
   */
  const aria = computed(() => {
    return {
      labelledby: props.label ? `${inputID.value}-label` : undefined,
      describedby: props.help ? `${inputID.value}-help` : undefined,
      errormessage: errorState.value ? `${inputID.value}-error` : undefined,
    }
  })

  /**
   * onInvalid is an Event callback for setting the default HTMLInputElement
   * validationMessage. It should be used as the callback for @invalid on an HTMLInputElement
   * to set the current validation error to the local errorState.
   * @param e Event
   */
  const onInvalid = (e: Event) => {
    if (e.type !== "invalid") {
      return
    }

    errorState.value = (e.target as HTMLInputElement).validationMessage
  }

  /**
   * validate is an event callback to retrigger an inputs checkValidity method.
   * This is only called when an existing error message exists as the result of an
   * @invalid event and clears the error message if it passes, otherwise it updates the message
   * with the current error.
   *
   * @param e Event
   */
  const validate = (e: Event) => {
    if (!errorState.value) {
      return
    }

    // this target will commonly be the same as targetInput, but not always.
    // example radio buttons trigger a change event from multiple inputs, but because they share
    // a name attribute, the browser will assume validation for the set of inputs.
    const target = e.target as HTMLInputElement
    if (!target.checkValidity()) {
      errorState.value = target.validationMessage
    } else {
      errorState.value = ""
    }
  }

  /**
   * inputValidation is a debounced version of validate.
   * it's useful for inputs that are typed by the user to prevent validation
   * from firing too frequently.
   */
  const inputValidation = debounce(validate, 350)

  return {
    aria,
    attrs,
    inputID,
    isDisabled,
    isRequired,
    nameAttr,
    errorState,
    onInvalid,
    validate,
    inputValidation,
  }
}

/**
 * hasAttribute determines if an HTML attribute value exists.  The conditions are based on
 * whether or not the attribute will be set on the HTML element.
 * @param attrs
 * @param name
 */
export const hasAttribute = (attrs: Record<string, unknown>, name: string) => {
  return (
    attrs[name] !== undefined &&
    attrs[name] !== null &&
    attrs[name] !== false &&
    attrs[name] !== 0
  )
}

/**
 * email validation regex pattern
 * used with input type="email" in the pattern attribute for html5 validation
 * exported as a raw string to support the escape backslash characters
 */
export const emailPattern = String.raw`^\w+([\-+.']\w+)*@\w+([\-.]\w+)*\.\w+([\-.]\w+)*$`

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

/**
 * converts an RFC 3339 string to a datetime-local input value string
 * used with BaseInput<type=datetime-local> as a v-model modifier
 * @param dt RFC 3339 date string
 * @returns string
 */
export const toDatetimeLocal = (dt: any): string => {
  if (typeof dt !== "string" || dt === "") {
    return ""
  }

  const date = new Date(dt)
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset())

  return date.toISOString().slice(0, 16)
}
