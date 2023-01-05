/**
 * RequestMethod
 * The HTTP request methods that our http client supports.
 */
export type RequestMethod =
  | "GET"
  | "get"
  | "PATCH"
  | "patch"
  | "PUT"
  | "put"
  | "POST"
  | "post"
  | "DELETE"
  | "delete"

/**
 * RequestOptions
 * The set of options available for any http client request.
 */
export interface RequestOptions {
  /**
   * Disable the full screen loading interface during the request when true.
   */
  skipLoader?: boolean
  /**
   * Artificially delay a request by the time specified when set.
   */
  withDelay?: number
}

export const HTTP_ERROR = "HttpError"
export const HTTP_CANCELLED_ERROR = "HttpCanceledError"

/**
 * HttpError
 * An http client error when the request is rejected.
 */
export class HttpError<T = unknown> extends Error {
  /**
   * The http response status code.
   */
  status: number

  /**
   * The http response body.
   */
  response?: T

  constructor(message?: string, status?: number, response?: T, name?: string) {
    super(message || "")
    this.name = name || HTTP_ERROR
    this.status = status || 0
    this.response = response
  }
}

/**
 * HttpPromise
 * The successfully resolved interface of an http client request.
 */
export interface HttpPromise<T = any> extends Promise<T> {}

/**
 * TrailsPromise
 * The successfully resolved interface of an http client request returned by @xy-planning-network/Trails.
 */
export interface TrailsPromise<T = any> extends Promise<TrailsResponse<T>> {}

/**
 * TrailsPromisePaged
 * The successfully resolved interface of a paged http client request returned by @xy-planning-network/Trails.
 */
export interface TrailsPromisePaged<T = any>
  extends Promise<TrailsResponsePaged<T>> {}

/**
 * TrailsResponse
 * A convenience interface to represent the shape of a Trails delivered API response.
 *
 * Example Usage:
 * interface User {
 *     id: number
 *     email: string
 * }
 *
 * BaseAPI.get<TrailsResponse<User>>(`/user/${id}`)
 *     .then(result => {
 *         const id = result.data.id
 *         const email = result.data.email
 *         const user = { ...result.data }
 *     })
 */
export interface TrailsResponse<T = any> {
  data: T
}

/**
 * TrailsResponsePaged
 * A convenience interface to represent the shape of a paginated Trails delivered API response.
 *
 * Example Usage:
 * interface User {
 *     id: number
 *     email: string
 * }
 *
 * BaseAPI.get<TrailsResponsePaged<User>>(`/users`)
 *     .then(result => {
 *         const currentPage = result.data.page
 *         const users = { ...result.data.items }
 *
 *         result.data.items.forEach(u => {
 *             console.log(u.id)
 *         })
 *     })
 */
export interface TrailsResponsePaged<T = any> {
  data: {
    items: T[]
    page: number
    perPage: number
    totalItems: number
    totalPages: number
  }
}

/**
 * QueryParams
 * Http GET request query params.
 */
export type QueryParams = Record<string, any>

/**
 * RequestPayload
 * Http POST and PUT payloads.
 */
export type RequestPayload = Record<string, any> | FormData

/**
 * HttpClient
 * The http client interface the BaseAPI implements.
 */
export interface HttpClient {
  /**
   * The method to make an http GET request.
   * @param path string
   * @param opts RequestOptions
   * @param params QueryParams
   * @returns HttpPromise<T>
   */
  get<T>(
    path: string,
    opts?: RequestOptions,
    params?: QueryParams
  ): HttpPromise<T>
  /**
   * The method to make an http DELETE request.
   * @param path string
   * @param opts RequestOptions
   * @returns HttpPromise<T>
   */
  delete<T>(path: string, opts?: RequestOptions): HttpPromise<T>
  /**
   * The method to make an http PATCH request.
   * @param path string
   * @param data RequestPayload
   * @param opts RequestOptions
   */
  patch<T>(
    path: string,
    data?: RequestPayload,
    opts?: RequestOptions
  ): HttpPromise<T>
  /**
   * The method to make an http POST request.
   * @param path string
   * @param data RequestPayload
   * @param opts RequestOptions
   */
  post<T>(
    path: string,
    data?: RequestPayload,
    opts?: RequestOptions
  ): HttpPromise<T>
  /**
   * The method to make an http PUT request.
   * @param path string
   * @param data RequestPayload
   * @param opts RequestOptions
   */
  put<T>(
    path: string,
    data?: RequestPayload,
    opts?: RequestOptions
  ): HttpPromise<T>
}
