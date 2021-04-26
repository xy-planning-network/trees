<script lang="ts">
import { defineComponent } from 'vue';
// Uncomment import and local "components" registration if library is not registered globally.
// import { TreesSample } from '@/entry.esm';

export default defineComponent({
  name: 'ServeDev',
  // components: {
  //  TreesSample,
  // }
});
</script>

<template>
  <div id="app">
    <trees-sample />
  </div>
</template>
