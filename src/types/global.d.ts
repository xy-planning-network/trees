import { Emitter } from "mitt";

export {};

declare global {
  interface Window {
    VueBus: Emitter;
  }
}
