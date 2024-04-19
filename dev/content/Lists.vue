<script setup lang="ts">
import { computed, h, ref } from "vue"
import {
  CalendarIcon,
  LocationMarkerIcon,
  UsersIcon,
  SpeakerphoneIcon,
  TrashIcon,
} from "@heroicons/vue/solid"
import type {
  TableColumns,
  TableActions,
  TableRowData,
  DynamicTableOptions,
} from "@/composables/table"
import NeedleTag from "./examples/NeedleTags.vue"
import { conifers } from "../../db.json"
import { Conifer } from "./types/tree"

const cards = [
  { primary: "Get Some", secondary: "You are gonna do well." },
  { primary: "Try It", secondary: "I'm proud of how far you've come." },
  { primary: "Nice Info", secondary: "Never stop trying." },
]
const cardsCopy = `<Cards cards="cards" />`
const cardsProps = [
  {
    name: "cards",
    required: true,
    type: "{ primary: string; secondary: string }",
  },
]
const detailListCopy = `<DetailList title="Things" url="/things"></DetailList>`
const detailListProps = [
  { name: "refreshTrigger", required: false, type: "number" },
  { name: "reloadTrigger", required: false, type: "number" },
  { name: "title", required: true, type: "string" },
  { name: "url", required: true, type: "string" },
]

const staticTableCopy = `<DataTable :table-columns="tableColumns" />`

const coniferList = ref(conifers.data.items)
const tableColumns: TableColumns<Conifer> = [
  { title: "Name", classNames: "font-bold", render: "name" },
  {
    alignment: "right",
    title: "Discovery Date",
    render: (tree) => {
      return new Date(tree.discoveryDate).toLocaleDateString("en-us")
    },
  },
  {
    title: "Needle Style",
    render: (tree) => {
      return h(NeedleTag, { tree: tree, onClickLeaf: announceTree })
    },
  },
]

const announceTree = (t: Conifer) => {
  alert(
    `${t.name} discovered on ${new Date(t.discoveryDate).toLocaleDateString(
      "en-us"
    )}`
  )
}

const staticTableActions = computed((): TableActions<Conifer> => {
  return {
    actions: [
      {
        onClick: announceTree,
        icon: SpeakerphoneIcon,
        label: "Speak",
      },
      {
        onClick: (d) => {
          const index = coniferList.value.findIndex((i) => {
            return i.id === d.id
          })

          coniferList.value.splice(index, 1)
        },
        icon: TrashIcon,
        label: "",
        disabled: coniferList.value.length <= 1,
      },
    ],
    type: "buttons",
  }
})

const staticTableProps = [
  { name: "tableActions", required: false, type: "TableActions<T>" },
  { name: "tableActionsType", required: false, type: "dropdown | buttons" },
  { name: "tableColumns", required: true, type: "TableColumns<T>" },
  { name: "tableData", required: true, type: "Record<string, any>" },
]

const dynamicTableActions: TableActions<Conifer> = {
  actions: [
    {
      label: "Refresh",
      onClick: (t, i, table) => table.refresh(),
    },
    {
      label: "Reset",
      onClick: (t, i, table) => table.reset(),
      disabled: (t) => t.type === "Scale-leaf",
    },
  ],
  type: "dropdown",
}

const dynamicTableOptions: DynamicTableOptions = {
  clickable: true,
  dateSearch: true,
  refreshTrigger: 0,
  search: true,
  url: "https://my-json-server.typicode.com/xy-planning-network/trees/conifers",
}

const handleDynamicTableOnClick = (e: TableRowData) => {
  window.alert("You clicked: " + e.name)
}

const tableCopy = `<DynamicTable :table-columns="tableColumns" :table-options="tableOptions" />`
const tableProps = [
  { name: "clickable", required: false, type: "boolean" },
  { name: "loader", required: false, type: "boolean" },
  { name: "tableActions", required: false, type: "TableActions<T>" },
  { name: "tableActionsType", required: false, type: "dropdown | buttons" },
  { name: "tableColumns", required: true, type: "TableColumns<T>" },
  { name: "tableOptions", required: true, type: "DynamicTableOptions" },
]
</script>
<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <ComponentLayout title="Cards">
        <template #description>
          This is for data that we want to show up on cards, hence the clever
          name.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="cardsCopy" />
          </label>
          <div class="mt-1">
            <Cards :cards="cards" />
            <PropsTable :props="cardsProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Detail List">
        <template #description>
          This relies primarily on slots to determine the content and actions
          that can be taken on an item. It primarily handles pagination,
          fetching new data, sorting, and filtering. The UI needs to be built
          out in the slot.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="detailListCopy" />
          </label>
          <div class="mt-1">
            <DetailList
              title="Things"
              url="https://my-json-server.typicode.com/xy-planning-network/trees/things"
            >
              <template #default="{ item }">
                <div class="block cursor-pointer hover:bg-gray-50">
                  <div class="px-4 py-4 sm:px-6">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-indigo-600 truncate">
                        {{ item.title }}
                      </p>
                      <div class="ml-2 shrink-0 flex">
                        <p
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                          v-text="item.title"
                        ></p>
                      </div>
                    </div>
                    <div class="mt-2 sm:flex sm:justify-between">
                      <div class="sm:flex">
                        <p class="flex items-center text-sm text-gray-500">
                          <UsersIcon
                            class="shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          {{ item.type }}
                        </p>
                        <p
                          class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6"
                        >
                          <LocationMarkerIcon
                            class="shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          Remote
                        </p>
                      </div>
                      <div
                        class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0"
                      >
                        <CalendarIcon
                          class="shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <p>
                          Started on
                          {{ " " }}
                          <time :datetime="item.created_at">{{
                            new Date(item.created_at * 1000).toLocaleString()
                          }}</time>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </DetailList>
            <PropsTable :props="detailListProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Static Table">
        <template #description>
          This is for tables where we already have the data and do not need to
          make an external call.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="staticTableCopy" />
          </label>
          <div class="mt-1">
            <DataTable
              :table-columns="tableColumns"
              :table-data="coniferList"
              :table-actions="staticTableActions"
            />
            <PropsTable :props="staticTableProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Table">
        <template #description>
          This bakes a table into simple column definitions. This can be
          combined with the ActionsDropdown for lots of nifty functionality.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="tableCopy" />
          </label>
          <div class="mt-1">
            <DynamicTable
              :table-columns="tableColumns"
              :table-options="dynamicTableOptions"
              :table-actions="dynamicTableActions"
              @click:row="handleDynamicTableOnClick"
            />
            <PropsTable :props="tableProps" />
          </div>
        </div>
      </ComponentLayout>
    </div>
  </div>
</template>
