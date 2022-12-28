import axios, { AxiosResponse, AxiosRequestConfig } from "axios"
import {
  HTTP_CANCELLED_ERROR,
  HttpClient,
  HttpError,
  HttpPromise,
  RequestOptions,
} from "./client"
import { useAppSpinner } from "@/composables/useSpinner"

/**
 * apiDelayIntercept delays the request of an api call by the configured withDelay value in RequestOptions
 * @param config RequestOptions
 * @returns RequestOptions
 */
const apiDelayReqIntercept = (config: RequestOptions & AxiosRequestConfig) => {
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
  opts: RequestOptions
): HttpPromise<T> => {
  const options: RequestOptions = {
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
          axios.isCancel(err) ? "HttpCanceledError" : undefined
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
  get<T = any>(
    path: string,
    opts?: RequestOptions,
    params?: Record<string, unknown>
  ) {
    return httpRequest<T>({ url: path, method: "GET", params }, opts || {})
  },
  delete<T = any>(path: string, opts?: RequestOptions) {
    return httpRequest<T>({ url: path, method: "DELETE" }, opts || {})
  },
  hasErrStatus(err: unknown, codes: number | number[]) {
    if (typeof codes === "number") {
      codes = [codes]
    }

    if (this.isHttpError(err)) {
      return codes.includes(err.status)
    }

    return false
  },
  isHttpCancel(err: unknown): boolean {
    return this.isHttpError(err) && err.name === HTTP_CANCELLED_ERROR
  },
  isHttpError(err: unknown): err is HttpError {
    return err instanceof HttpError
  },
  patch<T = any>(
    path: string,
    data: Record<string, unknown> | FormData,
    opts?: RequestOptions
  ) {
    return httpRequest<T>({ url: path, data, method: "PATCH" }, opts || {})
  },
  post<T = any>(
    path: string,
    data: Record<string, unknown> | FormData,
    opts?: RequestOptions
  ) {
    return httpRequest<T>({ url: path, data, method: "POST" }, opts || {})
  },
  put<T = any>(
    path: string,
    data: Record<string, unknown> | FormData,
    opts?: RequestOptions
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
