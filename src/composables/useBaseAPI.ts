import axios, { AxiosError, AxiosRequestConfig } from "axios"
import { ref, Ref, shallowRef, ShallowRef } from "vue"
import BaseAPI from "../api/base"
import type { RequestMethod, RequestOptions } from "../api/base"

export interface UseBaseAPI<T> {
  /**
   * Axios response data
   */
  result: Ref<T | undefined>
  /**
   * Any errors that may have occurred
   */
  error: ShallowRef<Error | AxiosError<T> | undefined>
  /**
   * Indicates if the request has finished
   * It is marked true after the first request and remains unchanged
   * In subsequent requests
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
   * Aborts the current request
   */
  abort: () => void
  /**
   * Manually call the axios request
   */
  execute: (
    data?: Record<string, unknown>,
    opts?: RequestOptions,
    config?: AxiosRequestConfig
  ) => Promise<T>
}

export default function useBaseAPI<T = any>(
  path: string,
  method: RequestMethod = "GET"
) {
  const result = ref<T | undefined>()
  const error = shallowRef<Error | AxiosError<T> | undefined>()
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
    data: Record<string, unknown> = {},
    opts: RequestOptions = {},
    config: AxiosRequestConfig = {}
  ): Promise<T> => {
    requestCount++
    const count = requestCount

    controller = new AbortController()

    isAborted.value = false
    isLoading.value = true

    const requestConfig: AxiosRequestConfig = {
      url: path,
      method: method,
      signal: controller.signal,
    }

    if (method === "GET") {
      requestConfig.params = data
    }

    if (["DELETE", "POST", "PUT"].includes(method)) {
      requestConfig.data = data
    }

    return BaseAPI.makeRequest<T>({ ...requestConfig, ...config }, opts)
      .then(
        (success) => {
          result.value = success
          error.value = undefined
          isAborted.value = false
          return success
        },
        (err) => {
          error.value = err

          if (axios.isCancel(err)) {
            isAborted.value = true
          }

          throw err
        }
      )
      .finally(() => {
        if (count == requestCount) {
          isLoading.value = false
        }
        isFinished.value = true
      })
  }

  return {
    result,
    error,
    isFinished,
    isLoading,
    isAborted,
    abort,
    execute,
  }
}

// convenience functions
export function useBaseAPIGet<T = any>(url: string): UseBaseAPI<T> {
  return useBaseAPI<T>(url, "GET")
}

export function useBaseAPIDelete<T = any>(url: string): UseBaseAPI<T> {
  return useBaseAPI<T>(url, "DELETE")
}

export function useBaseAPIPost<T = any>(url: string): UseBaseAPI<T> {
  return useBaseAPI<T>(url, "POST")
}

export function useBaseAPIPut<T = any>(url: string): UseBaseAPI<T> {
  return useBaseAPI<T>(url, "PUT")
}
