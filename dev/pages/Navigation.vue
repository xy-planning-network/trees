<script setup lang="ts">
import { computed, ref } from "vue"
import User from "@/composables/user"
import { ActionItem, useTabHistory } from "@/composables/nav"

defineProps<{
  user: User
}>()

const actionsDropdownCopy = `<ActionsDropdown :actions="actions" />`
const actionsDropdownProps = [
  { name: "actions", required: false, type: "ActionItems" },
  { name: "hideOnEmpty", required: false, type: "boolean" },
  { name: "label", required: false, type: "string" },
  { name: "placement", required: false, type: "Placement" },
]
const actionsButtonGroupCopy = `<ActionsButtonGroup :actions="actions" />`
const actionsButtonGroupProps = [
  { name: "actions", required: false, type: "ActionItems" },
]
const showMenuItem = ref(false)
const menuItems = computed((): ActionItem[] => {
  return [
    { label: "This is an action", onClick: () => alert("This is an action") },
    { label: "Do this?", onClick: () => alert("Do this?") },
    {
      label: "No! Do this.",
      onClick: () => alert("No! Do this."),
      show: showMenuItem.value,
    },
    {
      label: "Navigate",
      url: "https://xkcd.com/1425/",
      // openInTab: true,
      attrs: { rel: "no-follow" },
      onClick: (e: Event) =>
        console.log(
          "The Event is available if it needs to be read or handled.",
          e
        ),
    },
    {
      label: "Can't Navigate",
      url: "https://xkcd.com/1425/",
      disabled: true,
    },
    {
      label: "Hidden Navigation",
      url: "https://xkcd.com/1425/",
      show: false,
    },
  ].map((a) => {
    return {
      ...a,
      // disabled: true,
      // show: false,
    }
  })
})

const pagination = ref({
  page: 1,
  perPage: 10,
  totalItems: 100,
  totalPages: 100,
})

const paginatorCopy = `<Paginator v-model="pagination" />`
const paginatorProps = [
  {
    name: "modelValue",
    required: true,
    type: "{ page: number; perPage: number; totalItems: number; totalPages: number; }",
  },
]

const { activeTab, isActiveTab, tabs } = useTabHistory([
  { label: "Tab 1", value: "tab1" },
  { label: "Tab 2", value: "tab2" },
])
const tabsCopy = `<Tabs v-model="activeTab" :tabs="tabs" :pill-design="false" />`
const tabsPillDesign = ref(true)
const tabsProps = [
  { name: "modelValue", required: true, type: "string" },
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
]
</script>
<template>
  <div class="docs-page-wrapper">
    <ComponentLayout title="Actions Dropdown">
      <template #description>
        This is an accessible component that handles a dropdown menu to take
        further actions.
      </template>

      <div>
        <label
          class="relative flex items-center mr-1 text-sm font-medium text-gray-700"
        >
          <ClickToCopy :value="actionsDropdownCopy" />
        </label>
        <div class="space-y-3">
          <div class="flex flex-col items-center space-y-5">
            <ActionsDropdown :actions="menuItems" />
            <ActionsDropdown
              :actions="menuItems"
              label="Options"
              hide-on-empty
            />
          </div>
          <PropsTable :props="actionsDropdownProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Actions Button Group">
      <template #description>
        This is an accessible component that handles a button group layout.
      </template>

      <div>
        <label
          class="relative flex items-center mr-1 text-sm font-medium text-gray-700"
        >
          <ClickToCopy :value="actionsButtonGroupCopy" />
        </label>
        <div class="space-y-3">
          <div class="flex justify-center">
            <ActionsButtonGroup :actions="menuItems" />
          </div>
          <PropsTable :props="actionsButtonGroupProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Paginator">
      <template #description>
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
          <Paginator
            v-model="pagination"
            @update:model-value="
              $log(`Pagination update event, on page: (${$event.page})`)
            "
          />
          <PropsTable :props="paginatorProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Table Paginator">
      <template #description>
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
          <TablePaginator
            v-model="pagination"
            @update:model-value="
              $log(`Pagination update event, on page: (${$event.page})`)
            "
          />
          <PropsTable :props="paginatorProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Tabs">
      <template #description>
        These are used to display different groups of content. It turns into a
        select on mobile. When combined with the useTabHistory composable, the
        activeTab will be synced with window.location.search params.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="tabsCopy" />
        </label>
        <div class="mt-1">
          <div class="my-6">
            <Toggle v-model="tabsPillDesign" label="Use Pill Design" />
          </div>
          <Tabs
            v-model="activeTab"
            :pill-design="tabsPillDesign"
            :tabs="tabs"
            @update:model-value="
              $log(`v-model update event for Tabs: ${$event}`)
            "
          />
          <div class="bg-white shadow rounded-lg px-4 py-5 sm:px-6">
            <span v-if="isActiveTab('tab1')" class="xy-badge-yellow">
              Tab 1 Content
            </span>
            <span v-if="isActiveTab('tab2')" class="xy-badge-blue">
              Tab 2 Content
            </span>
          </div>

          <div class="my-10">
            <UseTabHistoryDocs />
          </div>
          <PropsTable :props="tabsProps" />
        </div>
      </div>
    </ComponentLayout>
  </div>
</template>
