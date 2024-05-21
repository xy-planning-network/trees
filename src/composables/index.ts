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

import type {
  DetailListConfig,
  DetailListAPI,
  SortDir,
} from "./list"

export type {
  UseBaseAPIOptions,
  UseBaseAPI,
  DetailListConfig,
  DetailListAPI,
  DynamicTableOptions,
  DynamicTableAPI,
  SortDir,
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

// navigation
import type { URLParams, URLParamValue, UseTabHistoryOpts } from "./nav"
export type { URLParams, URLParamValue, UseTabHistoryOpts }
import { useUrlSearchParams, useTabHistory } from "./nav"
export { useUrlSearchParams, useTabHistory }

// spinner
import { useSpinnerDisplay, useAppSpinner } from "./useSpinner"
export { useSpinnerDisplay, useAppSpinner }
