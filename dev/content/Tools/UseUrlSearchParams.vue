<script setup lang="ts">
import { useUrlSearchParams } from "@/composables";
import CodeSample from "../../helpers/CodeSample.vue"
import ProseBase from "../../helpers/ProseBase.vue"

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
  attributes: []
}

const attrOpts = [{label: "Type One", value: "type-one"}, {label: "Type Two", value: "type-two"}, {label: "Type Three", value: "type-three"}]
 
const searchParams = useUrlSearchParams(initialParams)
 
</script>

<template>
  <ComponentLayout :show-badge="false" title="useUrlSearchParams">
    <template #description>
      useUrlSearchParams is a composable methods that keeps the values of a
      record of params updates in the browser url.
    </template>

    <ProseBase>
      <h4>Example Usage:</h4>
      <h5>Script Setup</h5>
      <!-- prettier-ignore -->
      <CodeSample>{{
        `
<script setup lang="ts"&gt;
interface SearchParams {
   q: string
   isActive: boolean
   attributes: string[]
}

// If you're attempting to hydrate fields with a request that contains search params.
// Parse the params on the server and send them as a page prop to your search component.
const props = defineProps<{
    initialParams: SearchParams
}>

const searchParams = useUrlSearchParams(props.initialParam) 
</script&gt;
        `
      }}</CodeSample>

      <h5>Template</h5>
      <!-- prettier-ignore -->
      <CodeSample language="html">{{
        `
<template&gt;
    <BaseInput v-model="searchParams.q" label="Search" type="search" />
    <Checkbox v-model="searchParams.isActive" label="Is Active" />
    <MultiCheckboxes v-model="searchParams.attributes" label="Attributes" :options="attrOpts" />
</template&gt;
        `
      }}</CodeSample>
    </ProseBase>

    <div class="space-y-5">
        <h5>Use the input controls to mutate the search params ref and check the browser url for updates to the query string.</h5>
        <BaseInput v-model="searchParams.q" label="Search" type="search" />
        <Checkbox v-model="searchParams.isActive" label="Is Active" />
        <MultiCheckboxes v-model="searchParams.attributes" label="Attributes" :options="attrOpts" />
    </div>
  </ComponentLayout>
</template>
