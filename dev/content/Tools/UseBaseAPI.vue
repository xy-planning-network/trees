<script setup lang="ts">
import { isHttpError } from "@/api/base"
import { ReqOptions, TrailsRespPaged } from "@/api/client"
import { computed } from "vue"
import useBaseAPI from "../../../src/composables/useBaseAPI"
import { debounceLeading } from "../../../src/helpers/Debounce"
import CodeSample from "../../helpers/CodeSample.vue"
import ProseBase from "../../helpers/ProseBase.vue"

interface Conifer {
  id: number 
  name: number
  type: string
  leaf: {
    type: string
    length: string
  }
}

const { result, error, isLoading, isFinished, isAborted, hasFetched, execute, abort } =
  useBaseAPI<TrailsRespPaged<Conifer>>(
    "https://my-json-server.typicode.com/xy-planning-network/trees/conifers",
    "GET"
  )

const fetch = (opt: ReqOptions = {}, shouldAbort = false,) => {
  execute({ query: Date.now() }, opt)
  .then((response) => {
    // you could do something with this data variable
    // which has a Type of TrailsRespPaged<Conifer>, but the result
    // variable will already be a Ref<TrailsRespPaged<Conifer>>
    console.log(response, result.value)
  }).catch((err: unknown) => {
    // you could do something with this err variable
    // but the error variable will already be a ShallowRef<Error | HttpError<T>>
    console.log(err, error.value, isHttpError(err))
  })

  if (shouldAbort) {
    setTimeout(abort, 100)
  }
}

const fetchDebounce = debounceLeading(() => {
  abort()
  fetch({ withDelay: 0 }, false)
}, 50)


const buttonText = computed(() => {
  if (isLoading.value) return "Loading"
  if (hasFetched.value) return "Fetch Again"
  return "Fetch"
})

const buttonTextWithDelay = computed(() => {
  if (isLoading.value) return "Loading"
  if (hasFetched.value) return "Fetch Again w/Delay"
  return "Fetch w/Delay"
})

const buttonTextWithAbort = computed(() => {
  if (isLoading.value) return "Loading"
  if (hasFetched.value) return "Fetch Again & Abort"
  return "Fetch & Abort"
})
</script>

<template>
  
      <ComponentLayout :show-badge="false" title="useBaseAPI">
        <template #description>
          useBaseAPI is a set of composable methods that wrap up the BaseAPI functionality and returns a bunch of
          helpful reactive variables along with an execute and abort methods.
        </template>

        <ProseBase>
            <h4>The useBaseAPI Interface</h4>
            <CodeSample>{{`  
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
            `}}</CodeSample>

          <h4>Example Usage</h4>
            <CodeSample>{{`
import {
    useBaseAPI,
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

const {
  result,
  error,
  isLoading,
  isFinished,
  isAborted,
  hasFetched,
  execute,
  abort
} = useBaseAPI<TrailsRespPaged<Conifer>>("https://my-json-server.typicode.com/xy-planning-network/trees/things", "GET")

execute({ query: Date.now() }, { withDelay: 3000 })
  .then(data => {
    // you could do something with this data variable
    // which has a Type of TrailsRespPaged<Conifer>, but the result
    // variable will already be a Ref<TrailsRespPaged<Conifer>>
    console.log(data, result)
  }).catch((err: unknown) => {
    // you could do something with this err variable
    // but the error variable will already be a ShallowRef<Error | HttpError>
    console.log(err, error.value, isHttpError(err))
  })

// this computed function is ready with whatever result contains
const things = computed(() => { 
  return result.value?.items
})
  `}}</CodeSample></ProseBase>
        
        <div class="space-y-4">
          <div class="flex space-x-4">
            <button
              class="xy-btn"
              :disabled="isLoading"
              @click="fetch()"
            >
              {{ buttonText }}
            </button>

            <button
              class="xy-btn"
              :disabled="isLoading"
              @click="fetch({ withDelay: 1500 })"
            >
              {{ buttonTextWithDelay }}
            </button>

            <button
              class="xy-btn"
              :disabled="isLoading"
              @click="fetch({ withDelay: 1000 }, true)"
            >
              {{ buttonTextWithAbort }}
            </button>
          </div>

          <button
            class="xy-btn"
            @click="fetchDebounce"
          >
            Debounced w/Abort (click fast!)
          </button>
        </div>

        <ul class="space-y-2">
          <li><b>Fetched:</b> {{hasFetched}} (has run once)</li>
          <li><b>Loading:</b> {{isLoading}} (run's always)</li>
          <li><b>Finished:</b> {{isFinished}} (run's always)</li>
          <li><b>Aborted:</b> {{isAborted}} (when aborted, reset on new fetch)</li>
          <li><b>Error:</b><pre>{{error ? error : 'undefined'}}</pre></li>
          <li><b>Result:</b><pre class="bg-gray-50 p-2">{{result ? result : 'undefined'}}</pre></li>
        </ul>

        <ul v-if="result?.data" class="mt-6 space-y-2">
          <li v-for="conifer in result.data.items" :key="conifer.id">
            <b>{{conifer.name}}</b>: <em>{{conifer.leaf.type}}</em>
          </li>
        </ul>
        <p v-else>No trees on these trails.</p>
      </ComponentLayout>
</template>
