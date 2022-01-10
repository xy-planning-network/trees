import { TreesComponents } from "@/lib-components"

/**
 * When using App.use(Trees) include a
 * /// <reference types="@xy-planning-network/trees/types/components" /> or
 * import GlobalComponents from "@xy-planning-network/trees/types/components"
 * in the project.
 */
declare module "@vue/runtime-core" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalComponents extends TreesComponents {}
}
