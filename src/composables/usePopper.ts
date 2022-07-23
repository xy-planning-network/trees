import { ref, onMounted, watchEffect, VNode } from "vue"
import { createPopper, Options, Placement } from "@popperjs/core"

export type PopperPosition = Placement

export function usePopper(options: Options) {
  const reference = ref<VNode | HTMLElement>()
  const popper = ref<VNode | HTMLElement>()

  onMounted(() => {
    watchEffect((onInvalidate) => {
      if (!popper.value) return
      if (!reference.value) return

      const popperEl = "el" in popper.value ? popper.value.el : popper.value
      const referenceEl =
        "el" in reference.value ? reference.value.el : reference.value

      if (!(referenceEl instanceof HTMLElement)) return
      if (!(popperEl instanceof HTMLElement)) return

      const { destroy } = createPopper(referenceEl, popperEl, options)

      onInvalidate(destroy)
    })
  })

  return [reference, popper]
}
