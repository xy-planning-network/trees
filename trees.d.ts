/* eslint-disable */
import { DefineComponent, Plugin } from "vue";
import { AxiosPromise, AxiosRequestConfig } from "axios";
import API from "./src/types/api";

declare const Trees: Exclude<Plugin["install"], undefined>;
export default Trees;

export const ActionsDropdown: DefineComponent<{}, {}, any>;
export const Checkbox: DefineComponent<{}, {}, any>;
export const DateFilter: DefineComponent<{}, {}, any>;
export const DateRangePicker: DefineComponent<{}, {}, any>;
export const DetailList: DefineComponent<{}, {}, any>;
export const Flash: DefineComponent<{}, {}, any>;
export const Modal: DefineComponent<{}, {}, any>;
export const Paginator: DefineComponent<{}, {}, any>;
export const Radio: DefineComponent<{}, {}, any>;
export const SidebarLayout: DefineComponent<{}, {}, any>;
export const Select: DefineComponent<{}, {}, any>;
export const Spinner: DefineComponent<{}, {}, any>;
export const StackedLayout: DefineComponent<{}, {}, any>;
export const Table: DefineComponent<{}, {}, any>;
export const Tabs: DefineComponent<{}, {}, any>;

export const BaseAPI: {
  makeRequest(config: AxiosRequestConfig, opts: API.RequestOptions): AxiosPromise;
  get(path: string, opts: API.RequestOptions, params?: Record<string, unknown> | undefined): AxiosPromise;
  delete(path: string, opts: API.RequestOptions): AxiosPromise;
  post(path: string, data: Record<string, unknown>, opts: API.RequestOptions): AxiosPromise;
  put(path: string, data: Record<string, unknown>, opts: API.RequestOptions): AxiosPromise;
};
