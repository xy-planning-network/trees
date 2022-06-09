// Exposed Composables
import {
  default as useBaseAPI,
  useBaseAPIGet,
  useBaseAPIPut,
  useBaseAPIPost,
  useBaseAPIDelete,
} from "./useBaseAPI"

import type { UseBaseAPIOptions, UseBaseAPI } from "./useBaseAPI"

export type { UseBaseAPIOptions, UseBaseAPI }

export {
  useBaseAPI,
  useBaseAPIGet,
  useBaseAPIPut,
  useBaseAPIPost,
  useBaseAPIDelete,
}

export * from "./useFlashes"
