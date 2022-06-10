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

// Only expose the useFlashes composable for custom flashing and useAppFlasher.
import useAppFlasher, { useFlashes } from "./useFlashes"
import type { FlashMessage, FlashType, FlashStore, Flasher } from "./useFlashes"
export type { FlashMessage, FlashType, FlashStore, Flasher }
export { useFlashes, useAppFlasher }
