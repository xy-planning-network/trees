import axios, { AxiosResponse, AxiosRequestConfig } from "axios"

export type RequestMethod = "GET" | "PUT" | "POST" | "DELETE"

export interface RequestOptions {
  skipLoader?: boolean
  withDelay?: number
}

const apiAxiosInstance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API_URL || "/api/v1",
  responseType: "json",
  withCredentials: true,
})

const BaseAPI = {
  makeRequest<T = any>(config: AxiosRequestConfig, opts: RequestOptions) {
    config.data = JSON.stringify(config.data)
    config.headers = { "Content-Type": "application/json" }

    const wait = window.setTimeout(() => {
      if (!opts.skipLoader) window.VueBus.emit("Spinner-show")
    }, 200)

    return new Promise<T>((resolve, reject) => {
      setTimeout(
        () => {
          apiAxiosInstance(config)
            .then(
              (success: AxiosResponse<T>) => {
                resolve(success.data)
              },
              (err) => {
                reject(err)
              }
            )
            .finally(() => {
              window.clearTimeout(wait)
              if (!opts.skipLoader) window.VueBus.emit("Spinner-hide")
            })
        },
        opts?.withDelay ? opts.withDelay : 0
      )
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
