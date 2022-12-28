import { ref, Ref, shallowRef, ShallowRef } from "vue"
import BaseAPI, { httpRequest } from "../api/base"
import type {
  HttpPromise,
  HttpError,
  RequestMethod,
  RequestOptions,
  RequestPayload,
} from "../api/client"

/**
 * UseBaseAPIOptions extends Trees/RequestOptions
 * these options are used only in the instantiation
 * of a new UseBaseAPI composable
 */
export interface UseBaseAPIOptions extends RequestOptions {
  /**
   * Whether to immediately fire the execute function during instantiation
   */
  immediate?: boolean
}

/**
 * UseBaseAPI is a composable the wraps up the
 * usage of Trees/BaseAPI and returns reactive
 * state variables along with reusaable execute and abort functions
 */
export interface UseBaseAPI<T> {
  /**
   * Axios response data
   */
  result: Ref<T | undefined>
  /**
   * Any errors that may have occurred
   */
  error: ShallowRef<Error | HttpError<T> | undefined>
  /**
   * Indicates if the request has finished
   */
  isFinished: Ref<boolean>
  /**
   * Indicates if the request is currently loading
   */
  isLoading: Ref<boolean>
  /**
   * Indicates if the request was canceled
   */
  isAborted: Ref<boolean>
  /**
   * Indicates if a first request has completed
   */
  hasFetched: Ref<boolean>
  /**
   * Aborts the current request
   * can be used multiple times
   */
  abort: () => void
  /**
   * Manually call the axios request
   * can be used multiple times
   */
  execute: (data?: RequestPayload, opts?: RequestOptions) => HttpPromise<T>
}

/**
 * useBaseAPI is a composable wrapper of BaseAPI
 * @param path {string} the api path or full url for the
 * @param method {RequestMethod} the initial request type
 * @param initOpts {UseBaseAPIOptions}
 * @param initConfig {AxiosRequestConfig}
 * @returns {UseBaseAPI<T>}
 */
export default function useBaseAPI<T = any>(
  path: string,
  method: RequestMethod = "GET",
  initOpts: UseBaseAPIOptions = {}
): UseBaseAPI<T> {
  const result = ref<T | undefined>()
  const error = shallowRef<Error | HttpError<T> | undefined>()
  const hasFetched = ref<boolean>(false)
  const isFinished = ref<boolean>(false)
  const isLoading = ref<boolean>(false)
  const isAborted = ref<boolean>(false)
  let requestCount = 0

  let controller: AbortController | undefined
  const abort = () => {
    if (controller !== undefined) {
      controller.abort()
    }
  }

  const execute = (
    data: Record<string, unknown> | FormData = {},
    opts: RequestOptions = {}
  ): Promise<T> => {
    requestCount++
    const count = requestCount

    controller = new AbortController()

    isAborted.value = false
    isFinished.value = false
    isLoading.value = true

    const requestConfig = {
      data: ["PATCH", "patch", "POST", "post", "PUT", "put"].includes(method)
        ? data
        : {},
      method: method,
      params: ["GET", "get"].includes(method) ? data : {},
      signal: controller.signal,
      url: path,
    }

    return httpRequest<T>(requestConfig, { ...initOpts, ...opts })
      .then(
        (success) => {
          result.value = success
          error.value = undefined
          isAborted.value = false
          return success
        },
        (err) => {
          error.value = err

          if (BaseAPI.isHttpCancel(err)) {
            isAborted.value = true
          }

          throw err
        }
      )
      .finally(() => {
        // aborted or previous requests may be resolving
        //during an active request avoid mutating state when
        //the request count has incremented
        if (count == requestCount) {
          isFinished.value = true
          isLoading.value = false
        }
        hasFetched.value = true
      })
  }

  // allow immedate execution to set data variable during script setup
  if (initOpts?.immediate && initOpts.immediate === true) {
    execute()
  }

  return {
    result,
    error,
    isFinished,
    isLoading,
    isAborted,
    hasFetched,
    abort,
    execute,
  }
}

/**
 * useBaseAPIGet is a convenience function for useBaseAPI
 * @param path {string} the api path or full url for the
 * @param initOpts {UseBaseAPIOptions}
 * @param initConfig {AxiosRequestConfig}
 * @returns {UseBaseAPI<T>}
 */
export function useBaseAPIGet<T = any>(
  url: string,
  opts: UseBaseAPIOptions = {}
): UseBaseAPI<T> {
  return useBaseAPI<T>(url, "GET", opts)
}

/**
 * useBaseAPIDelete is a convenience function for useBaseAPI
 * @param path {string} the api path or full url for the
 * @param initOpts {UseBaseAPIOptions}
 * @param initConfig {AxiosRequestConfig}
 * @returns {UseBaseAPI<T>}
 */
export function useBaseAPIDelete<T = any>(
  url: string,
  opts: UseBaseAPIOptions = {}
): UseBaseAPI<T> {
  return useBaseAPI<T>(url, "DELETE", opts)
}

/**
 * useBaseAPIPatch is a convenience function for useBaseAPI
 * @param path {string} the api path or full url for the
 * @param initOpts {UseBaseAPIOptions}
 * @param initConfig {AxiosRequestConfig}
 * @returns {UseBaseAPI<T>}
 */
export function useBaseAPIPatch<T = any>(
  url: string,
  opts: UseBaseAPIOptions = {}
): UseBaseAPI<T> {
  return useBaseAPI<T>(url, "PATCH", opts)
}

/**
 * useBaseAPIPost is a convenience function for useBaseAPI
 * @param path {string} the api path or full url for the
 * @param initOpts {UseBaseAPIOptions}
 * @param initConfig {AxiosRequestConfig}
 * @returns {UseBaseAPI<T>}
 */
export function useBaseAPIPost<T = any>(
  url: string,
  opts: UseBaseAPIOptions = {}
): UseBaseAPI<T> {
  return useBaseAPI<T>(url, "POST", opts)
}

/**
 * useBaseAPIPut is a convenience function for useBaseAPI
 * @param path {string} the api path or full url for the
 * @param initOpts {UseBaseAPIOptions}
 * @param initConfig {AxiosRequestConfig}
 * @returns {UseBaseAPI<T>}
 */
export function useBaseAPIPut<T = any>(
  url: string,
  opts: UseBaseAPIOptions = {}
): UseBaseAPI<T> {
  return useBaseAPI<T>(url, "PUT", opts)
}
