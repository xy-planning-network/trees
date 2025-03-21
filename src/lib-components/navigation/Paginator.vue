<script setup lang="ts">
import { Pagination } from "@/composables/nav"
import { computed } from "vue"

const pagination = defineModel<Pagination>({ required: true })

const changePage = (page: number): void => {
  // NOTE(spk): reminder that defineModel does not change the
  // one-way data flow philosphy of Vue.js replace the entire
  // object to ensure the event is emitted.
  pagination.value = {
    ...pagination.value,
    page: page,
  }
}

const pageShortcuts = computed((): number[] => {
  const shortcuts: number[] = []

  // If total pages is less than or equal to 4, just return 1, 2, 3, 4
  if (pagination.value.totalPages <= 4) {
    for (let i = 0; i < pagination.value.totalPages; i++) {
      shortcuts.push(i + 1)
    }
    return shortcuts
  }

  // If there are more than 3 pages left, show these
  // e.g. [4, 5, 6, 7] when there are 8 total pages and the current page is 4
  const pagesLeft: number = pagination.value.totalPages - pagination.value.page
  if (pagesLeft >= 3) {
    for (let i = 0; i < 4; i++) {
      shortcuts.push(pagination.value.page + i)
    }
    return shortcuts
  }

  // If there are less than 3 pages left, count backwards from the last page
  // e.g. [5, 6, 7, 8] when on page 5, 6, 7, and 8 and there are 8 total pages
  for (let i = 0; i < 4; i++) {
    shortcuts.unshift(pagination.value.totalPages - i)
  }
  return shortcuts
})
</script>
<template>
  <div class="px-4 flex items-center justify-between sm:px-0">
    <div class="w-0 flex-1 flex">
      <a
        href="#"
        class="-mt-px border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm leading-5 font-medium focus:outline-none focus:text-gray-700 focus:border-gray-400"
        :class="
          pagination.page == 1
            ? 'text-gray-500 cursor-not-allowed pointer-events-none'
            : 'text-gray-700 hover:text-gray-900 hover:border-gray-300'
        "
        @click.prevent="changePage(pagination.page - 1)"
      >
        <svg class="mr-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Previous
      </a>
    </div>

    <div class="hidden md:flex">
      <a
        v-for="i in pageShortcuts"
        :key="i"
        href="#"
        class="-mt-px border-t-2 pt-4 px-4 inline-flex items-center text-sm leading-5 font-medium"
        :class="
          pagination.page === i
            ? 'border-blue-500 text-blue-600 focus:outline-none focus:text-blue-800 focus:border-blue-700'
            : 'border-transparent text-gray-700 hover:text-gray-900 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-400'
        "
        @click.prevent="changePage(i)"
        v-text="i"
      ></a>
    </div>

    <div class="w-0 flex-1 flex justify-end">
      <a
        href="#"
        class="-mt-px border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm leading-5 font-medium focus:outline-none focus:text-gray-700 focus:border-gray-400"
        :class="
          pagination.page >= pagination.totalPages
            ? 'text-gray-500 cursor-not-allowed pointer-events-none'
            : 'text-gray-700 hover:text-gray-900 hover:border-gray-300'
        "
        @click.prevent="changePage(pagination.page + 1)"
      >
        Next
        <svg class="ml-3 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    </div>
  </div>
</template>
