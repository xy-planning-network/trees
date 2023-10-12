import {
  Ref,
  computed,
  getCurrentInstance,
  onMounted,
  ref,
  toRef,
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
  max?: number
  min?: number
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

interface UseInputFieldConfig<T extends Input> {
  props: T
  targetInput: Ref<HTMLInputElement | null>
}

/**
 * useInputField provides a number of computed values, refs, and methods to support
 * wiring up reactive inputs.
 *
 * @param config UseInputFieldConfig
 */
export const useInputField = <T extends Input>(
  config: UseInputFieldConfig<T>
) => {
  // The fallthrough attributes received on the component.
  // This is used to simplify input prop management and let's common HTMLInputElement
  // attributes be set on the component with the expectation that it will function as though
  // it was a plain old HTMLInputElement.  ex: required, disabled
  const attrs = useAttrs()

  // The errorState allows you to directly mutate the v-model:error, manages the emitter for you.
  // This state is also used to set the default HTMLInputElement validation message in the onInvalid method.
  // When the component will support v-model:error it should defineEmit("update:error") in the component.
  const errorState = useLocalModel(config.props, "error")

  // The modelState allows you to directly mutate the v-model and manages the emitter for you.
  // When the component will support v-model is should defineEmit("update:modelValue") in the component.
  const modelState = useLocalModel(config.props, "modelValue")

  // targetInput is the input that will recieve error messages via the setCustomValidity() method.
  // In most cases the targetInput will be the primary input wrapped in the component template.
  // In other cases where there are multiple input components (radios, multi-checkboxes) or the input component is
  // synthetic (radio cards) the targetInput may be a hidden field or the first input in the list.
  // It's primary purpose is to be the recipient of the browsers focus for setting a validation error.
  const targetInput = toRef(config.targetInput)

  /**
   * inputID computes the id attribute for a input
   * the id attribute should always be unique in the DOM
   * and when the id attribute is not explicity set a unique value
   * is created.  This primarily aids in setting accessibility attributes.
   */
  const inputID = computed(() => {
    return (attrs.id as string) || Uniques.CreateIdAttribute()
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
   * onInvalid is a simple helper method for setting the default HTMLInputElement
   * validationMessage. It should typically be used as an invalid callback on HTMLInputElement
   * to sync the current validation error to the local errorState.
   * @param e Event
   */
  const onInvalid = (e: Event) => {
    if (e.type !== "invalid") {
      return
    }

    errorState.value = (e.target as HTMLInputElement).validationMessage
  }

  /**
   * validate clears any custom validation messages on the targetInput and
   * triggers a validation check on the event target.  This will clear validation
   * errors if the input that triggered this method passes validation.  Otherwise it
   * will update the errorState with the latest validation error.
   *
   * @param e Event
   */
  const validate = (e: Event) => {
    if (!errorState.value) {
      return
    }

    // validate should be called during input and change events.
    // we always clear the custom validation message from the targetInput
    // since there's no context here for why it was set in the first place
    // assume it is now valid until presented otherwise
    targetInput?.value?.setCustomValidity("")

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

  onMounted(() => {
    // watch the errorState to set and report the error on the target input
    // HTMLInputElements will typicall set the error state using the onInvalid helper
    // the invalid event is only fired during form submit events and is not a live validation
    // custom validation messages, should follow a similar pattern when possible by
    // setting the v-model:error value in a form submit callback.
    watch(errorState, () => {
      targetInput?.value?.setCustomValidity(errorState.value || "")

      if (errorState.value) {
        targetInput?.value?.reportValidity()
      }
    })
  })

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

/**
 * useLocalModel supports a two-way binding between a reactive prop and
 * a local ref.  It effectively allows you to do prop mutations in a way that
 * vue considers safe.
 *
 * vue/core has a version of this in it's experimental mode called useModel
 *
 * @param props component props
 * @param name component prop name to sync
 */
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
