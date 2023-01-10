/**
 * ReqMethod
 * The HTTP request methods that our http client supports.
 */
export type ReqMethod =
  | "DELETE"
  | "delete"
  | "GET"
  | "get"
  | "PATCH"
  | "patch"
  | "POST"
  | "post"
  | "PUT"
  | "put"

/**
 * ReqOptions
 * The set of options available for any http client request.
 */
export interface ReqOptions {
  /**
   * Disable the full screen loading interface during the request when true.
   */
  skipLoader?: boolean
  /**
   * Artificially delay a request by the time specified when set.
   */
  withDelay?: number
}

export const HTTP_ERR = "HttpError"
export const HTTP_ERR_CANCEL = "HttpErrorCanceled"

/**
 * HttpError
 * An http client error when the request is rejected.
 */
export class HttpError<T = unknown> extends Error {
  /**
   * The http response body.
   */
  response?: T

  /**
   * The http response status code.
   */
  status: number

  constructor(message?: string, status?: number, response?: T, name?: string) {
    super(message || "")
    this.name = name || HTTP_ERR
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
 *
 * Example Usage:
 * interface User {
 *     id: number
 *     email: string
 * }
 *
 * const UsersAPI = {
 *    update(
 *      id: number,
 *      data: ReqPayload,
 *      opts?: ReqOptions
 *    ): TrailsPromise<User> {
 *      return BaseAPI.put<TrailsResp<User>>(`/users/${id}`, data, opts)
 *    }
 * }
 */
export interface TrailsPromise<T = any> extends Promise<TrailsResp<T>> {}

/**
 * TrailsPromisePaged
 * The successfully resolved interface of a paged http client request returned by @xy-planning-network/Trails.
 *
 * Example Usage:
 * interface User {
 *     id: number
 *     email: string
 * }
 *
 * const UsersAPI = {
 *    index(opts?: ReqOptions, params?: QueryParams): TrailsPromisePaged<User> {
 *    return BaseAPI.get<TrailsRespPaged<User>>("/users", opts, params)
 *    }
 * }
 */
export interface TrailsPromisePaged<T = any>
  extends Promise<TrailsRespPaged<T>> {}

/**
 * TrailsResp
 * A convenience interface to represent the shape of a Trails delivered API response.
 *
 * Example Usage:
 * interface User {
 *     id: number
 *     email: string
 * }
 *
 * BaseAPI.get<TrailsResp<User>>(`/user/${id}`)
 *     .then((result) => {
 *         const id = result.data.id
 *         const email = result.data.email
 *         const user = result.data
 *     })
 */
export interface TrailsResp<T = any> {
  data: T
}

/**
 * TrailsRespPaged
 * A convenience interface to represent the shape of a paginated Trails delivered API response.
 *
 * Example Usage:
 * interface User {
 *     id: number
 *     email: string
 * }
 *
 * BaseAPI.get<TrailsRespPaged<User>>(`/users`)
 *     .then((result) => {
 *         const currentPage = result.data.page
 *         const users = result.data.items
 *
 *         users.forEach((u) => {
 *             console.log(u.id)
 *         })
 *     })
 */
export interface TrailsRespPaged<T = any> {
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
 * ReqPayload
 * Http POST and PUT payloads.
 */
export type ReqPayload = Record<string, any> | FormData

/**
 * HttpClient
 * The http client interface the BaseAPI implements.
 */
export interface HttpClient {
  /**
   * The method to make an http DELETE request.
   * @param path string
   * @param opts ReqOptions
   * @returns HttpPromise<T>
   */
  delete<T>(path: string, opts?: ReqOptions): HttpPromise<T>
  /**
   * The method to make an http GET request.
   * @param path string
   * @param opts ReqOptions
   * @param params QueryParams
   * @returns HttpPromise<T>
   */
  get<T>(path: string, opts?: ReqOptions, params?: QueryParams): HttpPromise<T>
  /**
   * The method to make an http PATCH request.
   * @param path string
   * @param data ReqPayload
   * @param opts ReqOptions
   */
  patch<T>(path: string, data?: ReqPayload, opts?: ReqOptions): HttpPromise<T>
  /**
   * The method to make an http POST request.
   * @param path string
   * @param data ReqPayload
   * @param opts ReqOptions
   */
  post<T>(path: string, data?: ReqPayload, opts?: ReqOptions): HttpPromise<T>
  /**
   * The method to make an http PUT request.
   * @param path string
   * @param data ReqPayload
   * @param opts ReqOptions
   */
  put<T>(path: string, data?: ReqPayload, opts?: ReqOptions): HttpPromise<T>
}
