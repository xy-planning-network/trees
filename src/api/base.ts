import axios, { AxiosResponse, AxiosRequestConfig } from "axios"
import {
  HTTP_ERR_CANCEL,
  HTTP_ERR,
  HttpClient,
  HttpError,
  HttpPromise,
  ReqOptions,
} from "./client"
import { useAppSpinner } from "@/composables/useSpinner"

/**
 * apiDelayIntercept delays the request of an api call by the configured withDelay value in ReqOptions
 * @param config ReqOptions
 * @returns ReqOptions
 */
const apiDelayReqIntercept = (config: ReqOptions & AxiosRequestConfig) => {
  const delay = config.withDelay || 0
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(config)
    }, Math.max(delay, 0))
  })
}

const apiAxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL || "/api/v1",
  responseType: "json",
  withCredentials: true,
})

// apply request intercepts
apiAxiosInstance.interceptors.request.use(apiDelayReqIntercept)

export const httpRequest = <T = any>(
  config: AxiosRequestConfig,
  opts: ReqOptions
): HttpPromise<T> => {
  const options: ReqOptions = {
    skipLoader: false,
    withDelay: 0,
    ...opts,
  }

  const wait = window.setTimeout(() => {
    if (options.skipLoader !== true) {
      useAppSpinner.show()
    }
  }, 200)

  return apiAxiosInstance({ ...config, ...opts })
    .then((success: AxiosResponse<T>) => {
      return success.data
    })
    .catch((err: unknown) => {
      if (axios.isAxiosError(err)) {
        throw new HttpError(
          err.message,
          err.response?.status,
          err.response?.data,
          axios.isCancel(err) ? HTTP_ERR_CANCEL : HTTP_ERR
        )
      }

      if (err instanceof Error) {
        throw new HttpError(err.message, 0)
      }

      throw new HttpError("An unknown error has occurred.", 0)
    })
    .finally(() => {
      if (options.skipLoader !== true) {
        useAppSpinner.hide()
      }

      window.clearTimeout(wait)
    })
}

const BaseAPI: HttpClient = {
  delete<T = any>(path: string, opts?: ReqOptions) {
    return httpRequest<T>({ url: path, method: "DELETE" }, opts || {})
  },
  get<T = any>(
    path: string,
    opts?: ReqOptions,
    params?: Record<string, unknown>
  ) {
    return httpRequest<T>({ url: path, method: "GET", params }, opts || {})
  },
  patch<T = any>(
    path: string,
    data: Record<string, unknown> | FormData,
    opts?: ReqOptions
  ) {
    return httpRequest<T>({ url: path, data, method: "PATCH" }, opts || {})
  },
  post<T = any>(
    path: string,
    data: Record<string, unknown> | FormData,
    opts?: ReqOptions
  ) {
    return httpRequest<T>({ url: path, data, method: "POST" }, opts || {})
  },
  put<T = any>(
    path: string,
    data: Record<string, unknown> | FormData,
    opts?: ReqOptions
  ) {
    return httpRequest<T>(
      {
        url: path,
        data,
        method: "PUT",
      },
      opts || {}
    )
  },
}

export default BaseAPI

/**
 * A type guard for checking if a variable is in the shape of a HttpError
 * @param err unknown
 * @returns err is HttpError
 */
export const isHttpError = <T>(err: unknown): err is HttpError<T> => {
  return err instanceof HttpError
}

/**
 * A convenience method for checking if a variable is a cancelled http request error.
 * @param err unknown
 * @returns boolean
 */
export const isHttpCancel = (err: unknown): boolean => {
  return isHttpError(err) && err.name === HTTP_ERR_CANCEL
}
