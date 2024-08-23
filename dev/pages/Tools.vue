<script setup lang="ts">
import BaseAPI from "../components/BaseAPI.vue"
import UseBaseAPI from "../components/UseBaseAPI.vue"
import UseUrlSearchParams from "../components/UseUrlSearchParams.vue"
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto space-y-8">
      <BaseAPI />
      <UseBaseAPI />
      <UseUrlSearchParams />
    </div>
  </div>
</template>
