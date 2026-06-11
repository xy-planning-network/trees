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
  TableActionButton,
  TableActionItem,
  TableActionLink,
  TableActions,
  TableBulkActions,
  TableBulkActionItem,
  TableColumn,
  TableColumns,
  TableCellAlignment,
  TableRowData,
  TableRowsData,
} from "./table"

import type { DetailListAPI, SortDir } from "./list"

export type {
  UseBaseAPIOptions,
  UseBaseAPI,
  DetailListAPI,
  DynamicTableOptions,
  DynamicTableAPI,
  SortDir,
  TableActionButton,
  TableActionItem,
  TableActionLink,
  TableActions,
  TableBulkActions,
  TableBulkActionItem,
  TableColumn,
  TableColumns,
  TableCellAlignment,
  TableRowData,
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

// dateRange
import {
  calendarDateToUnix,
  dateRangeLast7Days,
  dateRangeLast30Days,
  dateRangeThisMonth,
  dateRangeLastMonth,
  dateRangeThisYear,
  dateRangeLastYear,
  dateRangeClear,
} from "./dateRange"

export {
  calendarDateToUnix,
  dateRangeLast7Days,
  dateRangeLast30Days,
  dateRangeThisMonth,
  dateRangeLastMonth,
  dateRangeThisYear,
  dateRangeLastYear,
  dateRangeClear,
}

// flashes: Only expose the useFlashes composable for custom flashing and useAppFlasher.
import { useFlashes, useAppFlashes, useAppFlasher } from "./useFlashes"
import type { FlashMessage, FlashType, FlashStore, Flasher } from "./useFlashes"
export type { FlashMessage, FlashType, FlashStore, Flasher }
export { useFlashes, useAppFlashes, useAppFlasher }

// navigation
import type {
  ActionItem,
  ActionItems,
  ActionItemButton,
  ActionItemLink,
  NavItem,
  Pagination,
  URLParams,
  URLParamValue,
  UseTabHistoryOpts,
} from "./nav"

export type {
  ActionItem,
  ActionItems,
  ActionItemButton,
  ActionItemLink,
  NavItem,
  Pagination,
  URLParams,
  URLParamValue,
  UseTabHistoryOpts,
}

import {
  isActionItemButton,
  isActionItemLink,
  useUrlSearchParams,
  useTabHistory,
} from "./nav"

export {
  isActionItemButton,
  isActionItemLink,
  useUrlSearchParams,
  useTabHistory,
}

// spinner
import { useSpinnerDisplay, useAppSpinner } from "./useSpinner"
export { useSpinnerDisplay, useAppSpinner }
