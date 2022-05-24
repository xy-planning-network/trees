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

export interface RequestOptions extends AxiosRequestConfig {
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

interface APIResponse extends AxiosResponse {
  config: RequestOptions
}

/**
 * apiDelayIntercept delays the request of an api call by the configured withDelay value in RequestOptions
 * @param config RequestOptions
 * @returns Promise
 */
const apiDelayReqIntercept = (config: RequestOptions) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(config)
    }, config.withDelay || 0)
  })
}

/**
 * apiDataIntercept removes any secondary data properties from an Axios response.
 * example: an AxiosResponse has it's own data key and the server response also nests
 * it's primary response data under another data key.
 * This axios intercept should always be last in the chain of intercepts.
 * @param response AxiosResponse
 * @returns any
 */
const apiDataRespIntercept = (response: APIResponse) => {
  if (response.config.dataIntercept && response.data?.data) {
    return response.data
  }

  return response
}

const apiAxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL || "/api/v1",
  responseType: "json",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// apply request intercepts
apiAxiosInstance.interceptors.request.use(apiDelayReqIntercept)

// apply response intercepts
// the data intercept should be last in the chain as it heavily mutates the APIResponse
apiAxiosInstance.interceptors.response.use(apiDataRespIntercept)

const BaseAPI = {
  makeRequest<T = any>(opts: RequestOptions): Promise<T> {
    const wait = window.setTimeout(() => {
      if (!opts.skipLoader) {
        window.VueBus.emit("Spinner-show")
      }
    }, 200)

    return apiAxiosInstance(opts)
      .then((success) => success.data)
      .finally(() => {
        if (!opts.skipLoader) window.VueBus.emit("Spinner-hide")
        window.clearTimeout(wait)
      })
  },
  get<T = any>(
    path: string,
    opts: RequestOptions,
    params?: Record<string, unknown>
  ) {
    return this.makeRequest<T>({ url: path, method: "GET", params, ...opts })
  },
  delete<T = any>(path: string, opts: RequestOptions) {
    return this.makeRequest<T>({ url: path, method: "DELETE", ...opts })
  },
  post<T = any>(
    path: string,
    data: Record<string, unknown>,
    opts: RequestOptions
  ) {
    return this.makeRequest<T>({ url: path, data, method: "POST", ...opts })
  },
  put<T = any>(
    path: string,
    data: Record<string, unknown>,
    opts: RequestOptions
  ) {
    return this.makeRequest<T>({ url: path, data, method: "PUT", ...opts })
  },
}

export default BaseAPI
