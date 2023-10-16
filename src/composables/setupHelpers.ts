import { getCurrentInstance, watch, ref, computed } from "vue"
import type { Ref } from "vue"

/**
 * useModel supports a two-way binding between a reactive prop and
 * a local ref.  It effectively allows you to do prop mutations in a way that
 * vue considers safe.
 *
 * This is effectveily a copy of useModel from vuejs/core which is currently an experimental opt-in
 *
 * @param props component props
 * @param name component prop name to sync
 * @param options - local determines the reactivity pattern used when the prop you are tracking is optional, use local:true.
 */
export const useModel = <T extends Record<string, any>, K extends keyof T>(
  props: T,
  name: K,
  options?: { local?: boolean }
): Ref<T[K]> => {
  const i = getCurrentInstance()!

  if (options && options.local) {
    const proxy = ref<T[K]>(props[name])

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
  } else {
    return computed({
      get: () => props[name],
      set(value) {
        i.emit(`update:${String(name)}`, value)
      },
    })
  }
}
