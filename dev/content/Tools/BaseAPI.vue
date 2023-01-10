<script lang="ts" setup>
import CodeSample from "../../helpers/CodeSample.vue";
import ProseBase from "../../helpers/ProseBase.vue"
</script>

<template>
  <ComponentLayout :show-badge="false" title="BaseAPI">
    <template v-slot:description>
      Need an HTTP client? Don't worry we've got you covered. BaseAPI offers an
      easy to understand API for making http requests.
    </template>

    <ProseBase>
        <h4>The HttpClient Interface</h4>
        <CodeSample>{{`
/**
 * HttpPromise
 * The successfully resolved interface of an http client request.
 */
export interface HttpPromise<T = any> extends Promise<T> {}

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
        `}}</CodeSample>
      
        <h4>Example Usage</h4>
        <CodeSample>{{`
import {
    BaseAPI,
    HttpError,
    isHttpError,
    TrailsRespPaged
} from "@xy-planning-network/trees"

interface Conifer {
  id: number 
  name: number
  type: string
  leaf: {
    type: string
    length: string
  }
}

// make the api call to your endpoint
// Note: BaseAPI supports a generic type for the expected response shape
BaseAPI.get<TrailsRespPaged<Conifer>>("https://my-json-server.typicode.com/xy-planning-network/trees/things", {withDelay: 500}, {query: Date.now()})
    .then((result) => {
        // result will be inferred as the shape declared in the generic TrailsRespPaged<Conifer>
        const {page, totalPages, items} = result
        console.log(page, totalPages)
        
        // tree will be inferred as Confier
        items.forEach((tree) => {
            console.log(tree.name)
        })
    })
    .catch((err: HttpError | Error) => {
        // use the isHttpError type guard to handle http errors
        if(isHttpError(err)) {
            // handle http error
            console.log(err.status)
        } else {
          // handle unexpected error  
        }
    })
        `}}</CodeSample>

        <h4>Working with Trails</h4>
        <p>Trees offers up a number of convenient interfaces for annotating your expected API responses with TypeScript.</p>
        <CodeSample>{{`
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
 *      return BaseAPI.put<TrailsResp<User>>(\`/users/\${id}\`, data, opts)
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
 * BaseAPI.get<TrailsResp<User>>(\`/user/\${id}\`)
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
 * BaseAPI.get<TrailsRespPaged<User>>(\`/users\`)
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
        `}}</CodeSample>
    </ProseBase>
  </ComponentLayout>
</template>
