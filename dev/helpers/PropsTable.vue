<script setup lang="ts">
defineProps<{
  props: {
    name: string
    required: boolean
    type: string
  }[]
}>()
</script>
<template>
  <div
    class="mt-4 align-middle inline-block min-w-full border-b border-gray-200 overflow-x-scroll w-full"
  >
    <table class="min-w-full">
      <thead>
        <tr class="border-t border-gray-200">
          <th
            class="p-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider"
          >
            Prop
          </th>
          <th
            class="p-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider"
          >
            Required
          </th>
          <th
            class="p-2 border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider"
          >
            Type
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-100">
        <tr v-for="prop in props" :key="prop.name">
          <td class="p-2 text-sm text-gray-700" v-text="prop.name"></td>
          <td class="p-2 text-sm text-gray-700" v-text="prop.required"></td>
          <td
            class="p-2 text-sm text-gray-700 whitespace-pre-wrap"
            v-text="prop.type"
          ></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
