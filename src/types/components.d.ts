import { TreesComponents } from "@/lib-components"

declare module "@vue/runtime-core" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface GlobalComponents extends TreesComponents {}
}
