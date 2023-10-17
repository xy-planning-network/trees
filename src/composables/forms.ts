import { computed, ref, useAttrs } from "vue"
import Uniques from "@/helpers/Uniques"

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
