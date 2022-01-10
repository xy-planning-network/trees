<script setup lang="ts">
import { ref } from "vue"
import User from "@/composables/user"

defineProps<{
  user: User
}>()

const actionsDropdownCopy = `<ActionsDropdown :current-user="currentUser" :items="items" props-data="propsData" />`
const actionsDropdownProps = [
  { name: "currentUser", required: true, type: "User" },
  { name: "items", required: true, type: "Array<TableTypes.MenuItem>" },
  { name: "propsData", required: true, type: "any" },
]
const currentTab = ref("tab1")
const menuItems = [
  { label: "This is an action", event: "Navigation.EmitThisEvent1" },
  { label: "Do this?", event: "Navigation.EmitThisEvent2" },
  { label: "No! Do this.", event: "Navigation.EmitThisEvent3" },
]
const pagination = ref({
  page: 1,
  perPage: 10,
  totalItems: 100,
  totalPages: 10,
})
const paginatorCopy = `<Paginator v-model="pagination" />`
const paginatorProps = [
  {
    name: "modelValue",
    required: true,
    type: "{ page: number; perPage: number; totalItems: number; totalPages: number; }",
  },
]
const tabs = [
  { label: "Tab 1", value: "tab1" },
  { label: "Tab 2", value: "tab2" },
]
const tabsCopy = `<Tabs :tabs="tabs" :pill-design="false" v-model="currentTab" />`
const tabsProps = [
  {
    name: "tabs",
    required: true,
    type: "Array<{ label: string; value: string; }>",
  },
  {
    name: "pill-design",
    required: false,
    type: "boolean",
  },
  { name: "modelValue", required: true, type: "string" },
]
</script>
<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <ComponentLayout title="Actions Dropdown">
        <template v-slot:description>
          This is an accessible component that handles a dropdown menu to take
          further actions. It emits an event to the bus so that they can be
          handled by a parent or sibling component.
        </template>

        <div>
          <label
            class="relative flex justify-end items-center mr-1 text-sm font-medium text-gray-700"
          >
            <ClickToCopy :value="actionsDropdownCopy" />
          </label>
          <div class="mt-1">
            <ActionsDropdown
              :current-user="user"
              :items="menuItems"
              props-data="something"
            />
            <PropsTable :props="actionsDropdownProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Paginator">
        <template v-slot:description>
          This is used to create page numbers based on our server side paging
          implementation underneath a list of data.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="paginatorCopy" />
          </label>
          <div class="mt-1">
            <p class="text-center font-bold mt-2 mb-8">
              Current Page: {{ pagination.page }}
            </p>
            <Paginator v-model="pagination" />
            <PropsTable :props="paginatorProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Tabs">
        <template v-slot:description>
          These are used to display different groups of content. It turns into a
          select on mobile.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="tabsCopy" />
          </label>
          <div class="mt-1">
            <Tabs v-model="currentTab" :pill-design="true" :tabs="tabs" />
            <div class="bg-white shadow rounded-lg px-4 py-5 sm:px-6">
              <span v-if="currentTab === 'tab1'" class="xy-badge-yellow">
                Tab 1 Content
              </span>
              <span v-else class="xy-badge-blue"> Tab 2 Content </span>
            </div>
            <PropsTable :props="tabsProps" />
          </div>
        </div>
      </ComponentLayout>
    </div>
  </div>
</template>
