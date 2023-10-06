import { computed, useAttrs } from "vue"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

const createIdAttribute = (length = 8): string => {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return result
}

export const useInputField = () => {
  const attrs = useAttrs()

  const inputID = computed(() => {
    return (attrs.id as string) || createIdAttribute()
  })

  const isValid = computed(() => {
    return attrs.invalid === undefined
  })

  const isDisabled = computed(() => {
    return attrs.disabled !== undefined
  })

  const isRequired = computed(() => {
    return attrs.required !== undefined
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
    isValid,
    nameAttr,
  }
}
