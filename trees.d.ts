/* eslint-disable */
import { DefineComponent, Plugin } from "vue";

declare const Trees: Exclude<Plugin["install"], undefined>;
export default Trees;

export const Checkbox: DefineComponent<{}, {}, any>;
export const DateFilter: DefineComponent<{}, {}, any>;
export const DateRangePicker: DefineComponent<{}, {}, any>;
export const Input: DefineComponent<{}, {}, any>;
export const Layout: DefineComponent<{}, {}, any>;
export const Select: DefineComponent<{}, {}, any>;
export const Textarea: DefineComponent<{}, {}, any>;
