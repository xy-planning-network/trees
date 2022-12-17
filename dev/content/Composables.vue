<script setup lang="ts">
import { onMounted} from "vue"
import http from "@/api/base"
import { HttpError, RequestOptions, TrailsResponsePaged } from "@/api/client"
import { computed } from "vue"
import useBaseAPI from "../../src/composables/useBaseAPI"
import { debounceLeading } from "../../src/helpers/Debounce"

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
  useBaseAPI<TrailsResponsePaged<Conifer>>(
    "https://my-json-server.typicode.com/xy-planning-network/trees/conifers",
    "GET"
  )

const fetch = (opt: RequestOptions = {}, shouldAbort = false,) => {
  execute({ query: Date.now() }, opt)
  .then((response) => {
    // you could do something with this data variable
    // which has a Type of TrailsResponsePaged<Conifer>, but the result
    // variable will already be a Ref<TrailsResponsePaged<Conifer>>
    console.log(response, result.value)
  }).catch((err: Error | HttpError) => {
    // you could do something with this err variable
    // but the error variable will already be a ShallowRef<Error | HttpError<T>>
    console.log(err, error, http.isHttpError(err), http.hasErrStatus(err, 0))
    console.log(err.stack)
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

onMounted(async () => {    
  try {
    const { data } = await http.get<TrailsResponsePaged<Conifer>>("https://my-json-server.typicode.com/xy-planning-network/trees/conifers")
     console.log(data.items)
  } catch (e) {
    console.log(e)
  }

  http.get<TrailsResponsePaged<Conifer>>("https://my-json-server.typicode.com/xy-planning-network/trees/conifers")
    .then(({ data }) => {
      console.log(data)
    })
    .catch(e => {
      console.log(e)
    })
})
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <ComponentLayout :show-badge="false" title="useBaseAPI">
        <template v-slot:description>
          useBaseAPI wraps up the BaseAPI functionality and returns a bunch of
          helpful reactive variables along with an execute and abort methods.
        </template>

        
          <pre class="overflow-scroll bg-gray-50 p-4">
            <code class="language-typescript">{{`
interface TrailsResponsePaged<T> {
  page: number
  perPage: number
  totalItems: number
  totalPages: number
  items: T[]
}

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
} = useBaseAPI<TrailsResponsePaged<Conifer>>("https://my-json-server.typicode.com/xy-planning-network/trees/things", "GET")

execute({ query: Date.now() }, { withDelay: 3000 })
  .then(data => {
    // you could do something with this data variable
    // which has a Type of TrailsResponsePaged<Conifer>, but the result
    // variable will already be a Ref<TrailsResponsePaged<Conifer>>
    console.log(data, result)
  }).catch((err: Error | HttpError) => {
    // you could do something with this err variable
    // but the error variable will already be a ShallowRef<Error | HttpError>
    console.log(err, error)
  })

// this computed function is ready with whatever result contains
const things = computed(() => { 
  return result.value?.items
})
  `}}</code>
        </pre>
        
        <div class="space-y-4">
          <div class="flex space-x-4">
            <button
              class="xy-btn"
              @click="fetch()"
              :disabled="isLoading"
            >
              {{ buttonText }}
            </button>

            <button
              class="xy-btn"
              @click="fetch({ withDelay: 1500 })"
              :disabled="isLoading"
            >
              {{ buttonTextWithDelay }}
            </button>

            <button
              class="xy-btn"
              @click="fetch({ withDelay: 1000 }, true)"
              :disabled="isLoading"
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
    </div>
  </div>
</template>
