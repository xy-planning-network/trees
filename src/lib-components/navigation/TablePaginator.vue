<script setup lang="ts">
import { Pagination } from "@/composables/nav"
import { debounceFn } from "@/entry"
import { NumberInput, Select } from "@/lib-components"
import { computed } from "vue"

const props = defineProps<{
  pageOptions?: { label: string; value: number }[]
}>()

const pagination = defineModel<Pagination>({ required: true })

const page = computed({
  get: () => pagination.value.page,
  set: (v: number) => {
    pagination.value = {
      ...pagination.value,
      page: v,
    }
  },
})

const perPage = computed({
  get: () => pagination.value.perPage,
  set: (v: number) => {
    pagination.value = {
      ...pagination.value,
      perPage: v,
    }
  },
})

const pageSelectOpts = computed(() => {
  if (props.pageOptions) {
    return props.pageOptions
  }

  return [
    { label: "5 per page", value: 5 },
    { label: "10 per page", value: 10 },
    { label: "20 per page", value: 20 },
    { label: "50 per page", value: 50 },
  ]
})

const debouncePageInput = debounceFn((val: number | null) => {
  if (val === null) {
    return
  }

  if (val === page.value) {
    return
  }

  page.value = val
}, 350)

const onDown = debounceFn(() => {
  if (page.value <= 1) {
    return
  }

  page.value = page.value - 1
}, 250)

const onUp = debounceFn(() => {
  if (page.value >= pagination.value.totalPages) {
    return
  }

  page.value = page.value + 1
}, 250)

const range = computed(() => {
  const { page, perPage, totalItems } = pagination.value
  return {
    start: totalItems > 0 ? (page - 1) * perPage + 1 : 0,
    end: Math.min(page * perPage, totalItems),
  }
})
</script>

<template>
  <div
    class="flex flex-col items-center space-y-3.5 sm:flex-row sm:space-y-0 sm:gap-x-3 sm:justify-center"
  >
    <!--Range details-->
    <div
      class="text-center text-sm font-medium text-neutral-600 sm:text-left sm:mr-auto"
    >
      Showing {{ range.start }}-{{ range.end }} of
      {{ pagination.totalItems }} results
    </div>

    <!--Pager-->
    <div class="flex gap-3 items-center justify-center shrink-0">
      <button
        class="xy-btn-neutral"
        :disabled="page <= 1"
        type="button"
        @click.prevent="page--"
      >
        &larr; <span class="sr-only">Previous</span>
      </button>

      <div class="max-w-[50px]">
        <NumberInput
          :model-value="page"
          :min="1"
          :max="pagination.totalPages"
          type="number"
          @update:model-value="debouncePageInput"
          @keydown.down="onDown"
          @keydown.up="onUp"
        />
      </div>

      <div class="text-sm font-semibold">of {{ pagination.totalPages }}</div>

      <button
        class="xy-btn-neutral"
        :disabled="page >= pagination.totalPages"
        type="button"
        @click.prevent="page++"
      >
        <span class="sr-only">Next</span> &rarr;
      </button>
    </div>

    <!--Per Page Selector-->
    <div class="max-w-[150px] sm:ml-auto">
      <Select v-model="perPage" :options="pageSelectOpts" />
    </div>
  </div>
</template>
