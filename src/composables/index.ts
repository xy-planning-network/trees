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

// flashes: Only expose the useFlashes composable for custom flashing and useAppFlasher.
import { useFlashes, useAppFlashes, useAppFlasher } from "./useFlashes"
import type { FlashMessage, FlashType, FlashStore, Flasher } from "./useFlashes"
export type { FlashMessage, FlashType, FlashStore, Flasher }
export { useFlashes, useAppFlashes, useAppFlasher }

// spinner
import useAppSpinner, { useSpinnerDisplay } from "./useSpinner"
export { useAppSpinner, useSpinnerDisplay }
