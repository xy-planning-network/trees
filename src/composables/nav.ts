import {
  Component,
  FunctionalComponent,
  MaybeRef,
  Ref,
  RenderFunction,
  ref,
  toRaw,
  watch,
} from "vue"

export interface Item {
  icon?: Component | RenderFunction
  name: string
  openInTab?: boolean
  url: string
}

export interface Pagination {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
}

export interface ActionItem {
  disabled?: boolean | ((...args: any[]) => boolean)
  onClick: (...args: any[]) => void
  icon?: FunctionalComponent | RenderFunction
  label: string
  show?: boolean | ((...args: any[]) => boolean)
}

export interface UseTabHistoryOpts {
  /**
   * The initial value of activeTab.
   * The default value is tabs[0].value.
   *
   * When a valid tab value is found on window.location.search
   * it will replace the initial value.
   */
  initial?: string

  /**
   * The param name to use on window.location.search.
   * The default is "tab".
   */
  paramName?: string
}

/**
 * UseTabHistory is a convenience composable for adding history
 * support to tab based navigation.
 */
export interface UseTabHistory {
  /**
   * activeTab is a ref of currently visible tab.
   * The value typically should be one of tabs[number].value.
   */
  activeTab: Ref<string>
  /**
   * isActiveTab is a helper method for determining if a string value
   * is the currently active tab.  This is useful in templates where
   * content is conditionally displayed based on the activeTab.
   *
   * @param tab string typically should be one of tabs[number].value.
   * @return boolean
   */
  isActiveTab: (tab: string) => boolean
  /**
   * tabs is the Ref of initialized tabs.
   */
  tabs: Ref<
    {
      label: string
      value: string
    }[]
  >
}

/**
 * useTabHistory
 *
 * Example Usage:
 *
 * const {activeTab, isActiveTab, tabs} = useTabHistory([{label: "Tab One", value: "tab-1"}, {label: "Tab Two", value: "tab-2"}]})
 *
 * <Tabs v-model="activeTab" :tabs="tabs" />
 *
 * <div v-if="isActiveTab('tab-1')">Tab 1 Content</div>
 * <div v-if="isActiveTab('tab-2')">Tab 2 Content</div>
 *
 * @param opts UseTabHistoryOpts
 * @return UseTabHistory
 */
export const useTabHistory = (
  initialTabs: MaybeRef<
    {
      label: string
      value: string
    }[]
  >,
  opts?: UseTabHistoryOpts
): UseTabHistory => {
  const tabs = ref(initialTabs)
  const config = {
    initial: tabs?.value[0]?.value || "",
    paramName: opts?.paramName || "tab",
  }
  const activeTab = ref(config.initial)

  const isValidTab = (tab: string) => {
    return tabs.value.find((t) => t.value === tab) ? true : false
  }

  const isActiveTab = (tab: string) => {
    return activeTab.value === tab
  }

  // Kick off history tracking by applying the existing value
  // on window.location.search if it is a valid tab option.
  const params = new URLSearchParams(window.location.search)
  const initialParam = params.get(config.paramName)

  if (initialParam && isValidTab(initialParam)) {
    activeTab.value = initialParam
  }

  watch(activeTab, (tab) => {
    const params = new URLSearchParams(window.location.search)
    params.set(config.paramName, tab.toString())

    const queryString = params.toString() !== "" ? `?${params.toString()}` : ""

    window.history.replaceState(
      { tab: tab },
      document.title,
      `${window.location.pathname}${queryString}`
    )
  })

  return {
    activeTab,
    isActiveTab,
    tabs,
  }
}

/**
 * URLParamValue is the set of value types that are
 * currently spec'd to be parsed into a query string.
 */
export type URLParamValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]

/**
 * URLParams generic serves as a type constraint ensuring that
 * the search params record used only contains fields that are
 * currently spec'd to be parsed into a query string. See: URLParamValue
 *
 * Example:
 *
 * interface SearchParams {
 *    // All Good!
 *    q: string
 *    count: number
 *    isActive: boolean
 *    terms: string[]
 *    bucketOfNumbers: number[]
 *
 *    // Nope!
 *    nested: {
 *        qTwo: string
 *    }
 * }
 */
export type URLParams<T> = {
  [P in keyof T]: T[P] extends URLParamValue ? T[P] : never
}

/**
 * useUrlSearchParams accepts an initial set of search query params
 * in the shape of Record<string, URLParamValue> and tracks the values
 * of each param on window.location.search.
 *
 * This is a one-way sync where non-nullish, non-falsey values are popped
 * onto window.location.search as they are mutated.  The initial values are not read
 * from an existing query string on window.location.search as each values
 * type cannot be inferred safely.
 *
 * This composable ignores query params that may already exist on window.location.search
 * leaving the intact as much as possible, since it's not possible to determine where they
 * came from or what function they may serve.
 *
 * The return value is a ref of the initial set of params.
 *
 * Example Usage:
 * interface SearchParams {
 *    q: string
 *    isActive: boolean
 *    attributes: string[]
 * }
 *
 * // NOTE: initial params values should come from the
 * // server in the form of a page prop. Though some
 * // exceptions may exist.
 * const props = defineProps<{
 *    initialParams: SearchParams
 * }>
 *
 * const searchParams = useUrlSearchParams(props.initialParam)
 *
 * <BaseInput v-model="searchParams.q" label="Search" type="search" />
 * <Checkbox v-model="searchParams.isActive" label="Is Active" />
 * <MultiCheckboxes v-model="searchParams.attributes" label="Attributes" :options="attrOpts" />
 *
 * When initialized as {q: "", isActive: false, attributes: []}
 * the query string is not immediately updated.  Updates
 * begin once the Ref is mutated.
 * /path
 *
 * When mutated to {q: "jimothy bobbitz", isActive: true, attributes: ['att-1', 'att-3']}
 * /path?q=jimothy+bobbitz&isActive=true&attributes=att-1&attributes=att-3
 *
 * When mutated later back to {q: "", isActive: false, attributes: []}
 * /path?q=&isActive=false
 *
 * @param initial any Record<string, URLParamValue> like interface
 * @return Ref<T>
 */
export const useUrlSearchParams = <T>(initial: URLParams<T>) => {
  const searchParams = ref(initial)

  watch(
    searchParams,
    (p) => {
      const params = new URLSearchParams(window.location.search)
      for (const key in p) {
        const val = p[key]

        // remove the current key(s) to avoid doubling up on existing values
        params.delete(key)

        // avoid setting nullish values
        if (val == null || val == undefined) {
          continue
        }

        // append array types as multiple key:value pairs
        if (Array.isArray(val)) {
          val.forEach((val) => {
            params.append(key, val.toString())
          })
          continue
        }

        params.set(key, val.toString())
      }

      const queryString =
        params.toString() !== "" ? `?${params.toString()}` : ""

      window.history.replaceState(
        toRaw(p),
        document.title,
        `${window.location.pathname}${queryString}`
      )
    },
    { deep: true }
  )

  return searchParams
}
