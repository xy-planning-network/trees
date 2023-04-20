import { ComputedRef } from "vue"
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
  label: string
  callback: (...args: any[]) => void
  show?:
    | ((...args: any[]) => boolean)
    | Ref<boolean>
    | ComputedRef<boolean>
    | boolean
}

export interface ActionMenuEmit {
  id: string
  label: string
  show?:
    | ((...args: any[]) => boolean)
    | Ref<boolean>
    | ComputedRef<boolean>
    | boolean
}
