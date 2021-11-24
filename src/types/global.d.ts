import { Emitter } from "mitt";

import FlashTypes from "./flashes";

export {};

declare global {
  interface Window {
    Flashes: Array<Flash>;
    VueBus: Emitter;
  }
}
