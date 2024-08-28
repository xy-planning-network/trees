#### The useBaseAPI Interface

```ts
/**
 * UseBaseAPIOptions extends Trees/ReqOptions
 * these options are used only in the instantiation
 * of a new UseBaseAPI composable
 */
export interface UseBaseAPIOptions extends ReqOptions {
  /**
   * Whether to immediately fire the execute function during instantiation
   */
  immediate?: boolean
}

/**
 * UseBaseAPI is a composable the wraps up the
 * usage of Trees/BaseAPI and returns reactive
 * state variables along with reusaable execute and abort functions
 */
export interface UseBaseAPI<T> {
  /**
   * Axios response data
   */
  result: Ref<T | undefined>
  /**
   * Any errors that may have occurred
   */
  error: ShallowRef<Error | HttpError<T> | undefined>
  /**
   * Indicates if the request has finished
   */
  isFinished: Ref<boolean>
  /**
   * Indicates if the request is currently loading
   */
  isLoading: Ref<boolean>
  /**
   * Indicates if the request was canceled
   */
  isAborted: Ref<boolean>
  /**
   * Indicates if a first request has completed
   */
  hasFetched: Ref<boolean>
  /**
   * Aborts the current request
   * can be used multiple times
   */
  abort: () => void
  /**
   * Manually call the axios request
   * can be used multiple times
   */
  execute: (payload?: ReqPayload, opts?: ReqOptions) => HttpPromise<T>
}
```

#### Example Usage

```ts
import {
  useBaseAPI,
  HttpError,
  isHttpError,
  TrailsRespPaged,
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

const {
  result,
  error,
  isLoading,
  isFinished,
  isAborted,
  hasFetched,
  execute,
  abort,
} = useBaseAPI<TrailsRespPaged<Conifer>>(
  "https://my-json-server.typicode.com/xy-planning-network/trees/things",
  "GET"
)

execute({ query: Date.now() }, { withDelay: 3000 })
  .then((data) => {
    // you could do something with this data variable
    // which has a Type of TrailsRespPaged<Conifer>, but the result
    // variable will already be a Ref<TrailsRespPaged<Conifer>>
    console.log(data, result)
  })
  .catch((err: unknown) => {
    // you could do something with this err variable
    // but the error variable will already be a ShallowRef<Error | HttpError>
    console.log(err, error.value, isHttpError(err))
  })

// this computed function is ready with whatever result contains
const things = computed(() => {
  return result.value?.items
})
```
