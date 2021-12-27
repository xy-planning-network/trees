import axios, {
  AxiosError,
  AxiosPromise,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios"

export interface RequestOptions {
  skipLoader?: boolean
}

const apiAxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL || "/api/v1",
  responseType: "json",
  withCredentials: true,
})

const BaseAPI = {
  makeRequest(config: AxiosRequestConfig, opts: RequestOptions): AxiosPromise {
    config.data = JSON.stringify(config.data)
    config.headers = { "Content-Type": "application/json" }

    return new Promise((resolve, reject) => {
      const wait = window.setTimeout(() => {
        if (!opts.skipLoader) window.VueBus.emit("Spinner-show")
      }, 200)

      apiAxiosInstance(config).then(
        (success: AxiosResponse) => {
          window.clearTimeout(wait)
          if (!opts.skipLoader) window.VueBus.emit("Spinner-hide")
          resolve(success.data)
        },
        (error: AxiosError) => {
          // TODO: come back once we've finalized format for API response and
          // have nice UI that their session is expired with redirect to login
          // page
          window.clearTimeout(wait)
          if (!opts.skipLoader) window.VueBus.emit("Spinner-hide")
          reject(error.response)
        }
      )
    })
  },
  get(
    path: string,
    opts: RequestOptions,
    params?: Record<string, unknown>
  ): AxiosPromise {
    return this.makeRequest({ url: path, method: "GET", params }, opts)
  },
  delete(path: string, opts: RequestOptions): AxiosPromise {
    return this.makeRequest({ url: path, method: "DELETE" }, opts)
  },
  post(
    path: string,
    data: Record<string, unknown>,
    opts: RequestOptions
  ): AxiosPromise {
    return this.makeRequest({ url: path, data, method: "POST" }, opts)
  },
  put(
    path: string,
    data: Record<string, unknown>,
    opts: RequestOptions
  ): AxiosPromise {
    return this.makeRequest({ url: path, data, method: "PUT" }, opts)
  },
}

export default BaseAPI
