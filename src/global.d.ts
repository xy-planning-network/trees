import { Emitter } from "mitt"

/**
 * When using window.VueBus.emit("Flash-show-generic-error", "support@trees.com") include
 * /// <reference types="@xy-planning-network/trees/types/global" />
 * in the project.
 */
declare global {
  interface Window {
    Flashes: Array<{ type?: string; message: string }>
    VueBus: Emitter
  }
}
