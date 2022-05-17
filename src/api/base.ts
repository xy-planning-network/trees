import axios, { AxiosResponse, AxiosRequestConfig } from "axios"

export type RequestMethod =
  | "GET"
  | "get"
  | "PUT"
  | "put"
  | "POST"
  | "post"
  | "DELETE"
  | "delete"

export interface TreesResponse<T> extends AxiosResponse<T> {
  data: T
}

export interface RequestOptions {
  dataIntercept?: boolean
  skipLoader?: boolean
  withDelay?: number
}

const apiAxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL || "/api/v1",
  responseType: "json",
  withCredentials: true,
})

/**
 * apiDataIntercept removes any secondary data properties from an Axios response.
 * example: an AxiosResponse has it's own data key and the server response also nests
 * it's primary response data under another data key.
 * @param response AxiosResponse
 * @returns any
 */
const apiDataIntercept = (response: AxiosResponse) => {
  if (response.data?.data) {
    return response.data
  }

  return response
}

/**
 * apiDelay is a thin wrapper for causing some function to run on a delay
 * @param func (...args: any[]) => void
 * @param delay number
 */
const apiDelay = (func: (...args: any[]) => void, delay = 0) => {
  setTimeout(func, delay)
}

const BaseAPI = {
  makeRequest<T = any>(
    config: AxiosRequestConfig,
    opts: RequestOptions
  ): Promise<T> {
    config.data = JSON.stringify(config.data)
    config.headers = { "Content-Type": "application/json" }

    let dataIntercept: number | null

    if (opts.dataIntercept) {
      dataIntercept =
        apiAxiosInstance.interceptors.response.use(apiDataIntercept)
    }

    const wait = window.setTimeout(() => {
      if (!opts.skipLoader) {
        window.VueBus.emit("Spinner-show")
      }
    }, 200)

    return new Promise<T>((resolve, reject) => {
      apiAxiosInstance(config)
        .then(
          (success) => {
            apiDelay(() => {
              resolve(success.data)
            }, opts.withDelay || 0)
          },
          (err) => {
            apiDelay(() => {
              reject(err)
            }, opts.withDelay || 0)
          }
        )
        .finally(() => {
          if (dataIntercept !== null) {
            apiAxiosInstance.interceptors.response.eject(dataIntercept)
          }

          apiDelay(() => {
            window.clearTimeout(wait)
            if (!opts.skipLoader) window.VueBus.emit("Spinner-hide")
          }, opts.withDelay || 0)
        })
    })
  },
  get<T = any>(
    path: string,
    opts: RequestOptions,
    params?: Record<string, unknown>
  ) {
    return this.makeRequest<T>({ url: path, method: "GET", params }, opts)
  },
  delete<T = any>(path: string, opts: RequestOptions) {
    return this.makeRequest<T>({ url: path, method: "DELETE" }, opts)
  },
  post<T = any>(
    path: string,
    data: Record<string, unknown>,
    opts: RequestOptions
  ) {
    return this.makeRequest<T>({ url: path, data, method: "POST" }, opts)
  },
  put<T = any>(
    path: string,
    data: Record<string, unknown>,
    opts: RequestOptions
  ) {
    return this.makeRequest<T>({ url: path, data, method: "PUT" }, opts)
  },
}

export default BaseAPI
