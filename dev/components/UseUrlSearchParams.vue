<script setup lang="ts">
import { useUrlSearchParams } from "@/composables"

interface SearchParams {
  q: string
  isActive: boolean
  attributes: string[]
}

// NOTE: this should tyically come from the server in the form
// of a page prop.  Though some exceptions may exist.
const initialParams: SearchParams = {
  q: "",
  isActive: false,
  attributes: [],
}

const attrOpts = [
  { label: "Type One", value: "type-one" },
  { label: "Type Two", value: "type-two" },
  { label: "Type Three", value: "type-three" },
]

const searchParams = useUrlSearchParams(initialParams)
</script>

<template>
  <ComponentLayout :show-badge="false" title="useUrlSearchParams">
    <template #description>
      useUrlSearchParams is a composable methods that keeps the values of a
      record of params updates in the browser url.
    </template>

    <UseUrlSearchParamsDocs />

    <div class="space-y-5">
      <h5>
        Use the input controls to mutate the search params ref and check the
        browser url for updates to the query string.
      </h5>
      <BaseInput v-model="searchParams.q" label="Search" type="search" />
      <Checkbox v-model="searchParams.isActive" label="Is Active" />
      <MultiCheckboxes
        v-model="searchParams.attributes"
        label="Attributes"
        :options="attrOpts"
      />
    </div>
  </ComponentLayout>
</template>
