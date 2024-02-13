<script setup lang="ts">
import { computed, ref } from "vue"
import User from "@/composables/user"
import { ActionItem, useTabHistory } from "@/composables/nav"
import ProseBase from "../helpers/ProseBase.vue"
import CodeSample from "../helpers/CodeSample.vue"

defineProps<{
  user: User
}>()

const actionsDropdownCopy = `<ActionsDropdown :items="items" />`
const actionsDropdownProps = [
  { name: "items", required: true, type: "ActionMenuItem[]" },
]
const showMenuItem = ref(false)
const menuItems = computed((): ActionItem[] => {
  return [
    { label: "This is an action", onClick: () => alert("This is an action") },
    { label: "Do this?", onClick: () => alert("Do this?") },
    {
      label: "No! Do this.",
      onClick: () => alert("No! Do this."),
      show: () => {
        return showMenuItem.value
      },
    },
  ]
})

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
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <ComponentLayout title="Actions Dropdown">
        <template #description>
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
            <ActionsDropdown :actions="menuItems" />
            <PropsTable :props="actionsDropdownProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Paginator">
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
            <Paginator v-model="pagination" />
            <PropsTable :props="paginatorProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Tabs">
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
              <ProseBase>
                <h4>Example Usage with useTabHistory</h4>
                <p>
                  Note: if you don't wish to track the tab state on the url,
                  just pass your ref and tabs directly to the component.
                </p>
                <h5>Script Setup</h5>
                <!-- prettier-ignore -->
                <CodeSample>{{`
<script setup lang="ts"&gt;
const {activeTab, isActiveTab, tabs} = useTabHistory(
    [{label: "Tab One", value: "tab-1"}, {label: "Tab Two", value: "tab-2"}]
})
</script&gt;
`}}</CodeSample>

                <h5>Template</h5>
                <!-- prettier-ignore -->
                <CodeSample language="html">{{`
<template&gt;
    <Tabs v-model="activeTab" :tabs="tabs" />
    <div v-if="isActiveTab('tab-1')">Tab 1 Content</div>
    <div v-if="isActiveTab('tab-2')">Tab 2 Content</div>
</template&gt;
`}}</CodeSample>
              </ProseBase>
            </div>
            <PropsTable :props="tabsProps" />
          </div>
        </div>
      </ComponentLayout>
    </div>
  </div>
</template>
