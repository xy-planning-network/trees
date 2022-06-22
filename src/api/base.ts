import { useAppSpinner } from "@/composables/useSpinner"
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

export interface RequestOptions {
  /**
   * returns the nested data key inside the AxiosResponse data when true
   */
  dataIntercept?: boolean
  /**
   * disables the full screen loading interface during the request when true
   */
  skipLoader?: boolean
  /**
   * artificially delay's the request by the time specified when set
   */
  withDelay?: number
}

interface APIResponse<T = any> extends AxiosResponse<T> {
  config: RequestOptions & AxiosRequestConfig
}

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

/**
 * apiDataIntercept promotes any secondary data keys from an Axios response to the first level data key.
 * example: an AxiosResponse has it's own data key and the server response also nests it's primary response
 * payload under another data key, that payload data is promoted to being directly under the AxiosResponse data key.
 * @param response APIResponse
 * @returns APIResponse
 */
const apiDataRespIntercept = (response: APIResponse) => {
  if (response.config.dataIntercept && response.data?.data) {
    response.data = response.data.data
  }

  return response
}

const apiAxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL || "/api/v1",
  responseType: "json",
  withCredentials: true,
})

// apply request intercepts
apiAxiosInstance.interceptors.request.use(apiDelayReqIntercept)

// apply response intercepts
apiAxiosInstance.interceptors.response.use(apiDataRespIntercept)

const BaseAPI = {
  makeRequest<T = any>(
    config: AxiosRequestConfig,
    opts: RequestOptions
  ): Promise<T> {
    const wait = window.setTimeout(() => {
      if (!opts.skipLoader) {
        useAppSpinner().show()
      }
    }, 200)

    return apiAxiosInstance({ ...config, ...opts })
      .then((success) => success.data)
      .finally(() => {
        if (!opts.skipLoader) useAppSpinner().hide()
        window.clearTimeout(wait)
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
    data: Record<string, unknown> | FormData,
    opts: RequestOptions
  ) {
    return this.makeRequest<T>({ url: path, data, method: "POST" }, opts)
  },
  put<T = any>(
    path: string,
    data: Record<string, unknown> | FormData,
    opts: RequestOptions
  ) {
    return this.makeRequest<T>(
      {
        url: path,
        data,
        method: "PUT",
      },
      opts
    )
  },
}

export default BaseAPI
