#### Example Usage

```vue
<script setup lang="ts">
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
</script>

<template>
  <BaseInput v-model="searchParams.q" label="Search" type="search" />
  <Checkbox v-model="searchParams.isActive" label="Is Active" />
  <MultiCheckboxes
    v-model="searchParams.attributes"
    label="Attributes"
    :options="attrOpts"
  />
</template>
```
