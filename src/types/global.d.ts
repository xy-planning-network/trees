import { Emitter } from "mitt";

export {};

declare global {
  interface Window {
    Flashes: Array<{ type?: string; message: string }>;
    VueBus: Emitter;
  }
}
