// Exposed Composables
import {
  default as useBaseAPI,
  useBaseAPIGet,
  useBaseAPIPatch,
  useBaseAPIPut,
  useBaseAPIPost,
  useBaseAPIDelete,
} from "./useBaseAPI"

import type { UseBaseAPIOptions, UseBaseAPI } from "./useBaseAPI"

import type {
  DynamicTableOptions,
  DynamicTableAPI,
  TableActionItem,
  TableColumn,
  TableActions,
  TableCellAlignment,
  TableRowData,
  TableColumns,
  TableRowsData,
} from "./table"

export type {
  UseBaseAPIOptions,
  UseBaseAPI,
  DynamicTableOptions,
  DynamicTableAPI,
  TableActionItem,
  TableColumn,
  TableActions,
  TableCellAlignment,
  TableRowData,
  TableColumns,
  TableRowsData,
}

export {
  useBaseAPI,
  useBaseAPIGet,
  useBaseAPIPatch,
  useBaseAPIPut,
  useBaseAPIPost,
  useBaseAPIDelete,
}

// flashes: Only expose the useFlashes composable for custom flashing and useAppFlasher.
import { useFlashes, useAppFlashes, useAppFlasher } from "./useFlashes"
import type { FlashMessage, FlashType, FlashStore, Flasher } from "./useFlashes"
export type { FlashMessage, FlashType, FlashStore, Flasher }
export { useFlashes, useAppFlashes, useAppFlasher }

// spinner
import { useSpinnerDisplay, useAppSpinner } from "./useSpinner"
export { useSpinnerDisplay, useAppSpinner }
