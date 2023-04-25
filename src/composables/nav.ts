import type { Component, FunctionalComponent, RenderFunction } from "vue"

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
  event: (...args: any[]) => void
  icon?: FunctionalComponent | RenderFunction
  label: string
  show?: boolean | ((...args: any[]) => boolean)
}
