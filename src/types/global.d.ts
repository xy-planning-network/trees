import { Emitter } from "mitt";

export {};

declare global {
  interface Window {
    Flashes: Array<{ message: string }>;
    VueBus: Emitter;
  }
}
