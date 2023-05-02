import { Ref, computed, ref } from "vue"
import { ActionItem } from "./nav"

export const useActionItems = (items: ActionItem[] | Ref<ActionItem[]>) => {
  const actionItems = ref(items)

  const hasActions = computed(() => {
    return actions.value.length > 0
  })

  const actions = computed(() => {
    return actionItems.value
      .map((a) => {
        return {
          ...a,
          disabled:
            a.disabled !== undefined
              ? typeof a.disabled === "boolean"
                ? a.disabled
                : a.disabled()
              : false,
          show:
            a.show !== undefined
              ? typeof a.show === "boolean"
                ? a.show
                : a.show()
              : true,
        }
      })
      .filter((a) => {
        return a.show
      })
  })

  return {
    actions,
    hasActions,
  }
}
