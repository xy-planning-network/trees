import {
  Component,
  FunctionalComponent,
  MaybeRef,
  RenderFunction,
  ref,
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
 * useTabNav
 *
 * Example Usage:
 *
 * const {activeTab, tabs} = useTabNav({
 *    tabs: [{label: "Tab One", value: "tab-1"}, {label: "Tab Two", value: "tab-2"}]
 *    useHistory: true,
 * })
 *
 * <Tabs v-model="activeTab" :tabs="tabs" />
 *
 * <div v-if="activeTab === 'tab-1'">Tab 1 Content</div>
 * <div v-if="activeTab === 'tab-2'">Tab 2 Content</div>
 *
 * @param opts UseUrlTabParamOpts
 */

export const useTabHistory = (
  initialTabs: MaybeRef<
    {
      label: string
      value: string
    }[]
  >,
  opts?: UseTabHistoryOpts
) => {
  const tabs = ref(initialTabs)
  const config = {
    initial: tabs?.value[0]?.value || "",
    paramName: "tab",
    ...opts,
  }
  const activeTab = ref(config.initial)

  const isTab = (tab: string) => {
    return tabs.value.find((t) => t.value === tab) ? true : false
  }

  // Kick off history tracking by applying the existing value
  // on window.location.search if it is a valid tab option.
  const params = new URLSearchParams(window.location.search)
  const initialParam = params.get(config.paramName)

  if (initialParam && isTab(initialParam)) {
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
    tabs,
  }
}
