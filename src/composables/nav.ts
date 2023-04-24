import { ComputedRef, FunctionalComponent } from "vue"
import { Ref } from "vue"
import { Component, RenderFunction } from "vue"

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

export interface ActionMenuItem {
  icon?: FunctionalComponent | RenderFunction
  label: string
  event: (...args: any[]) => void
  enable?:
    | ((...args: any[]) => boolean)
    | Ref<boolean>
    | ComputedRef<boolean>
    | boolean
}
