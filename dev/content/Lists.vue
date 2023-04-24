<script setup lang="ts">
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
  DynamicTableOptions,
} from "@/composables/table"
import { computed, h, ref } from "vue"

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

const staticTableCopy = `<DataTable :table-data="tableData" />`

interface Data {
  this: string
  does: string
  not: string
  change: string
}

const staticData = ref<Data[]>([
  { this: "Jimothy", does: "says", not: "what", change: "?" },
  { this: "Timothy", does: "says", not: "how", change: "?" },
  { this: "Frimothy", does: "says", not: "never", change: "!" },
  { this: "Limothy", does: "says", not: "can we", change: "?" },
  { this: "Yimpothy", does: "says", not: "do it", change: "!" },
])

const staticTableColumns: TableColumns<Data> = [
  { title: "This", render: "this" },
  {
    title: "Does",
    render: (data) => {
      return data["does"]
    },
  },
  {
    alignment: "left",
    title: "Not",
    render: (data) => {
      return h("pre", [h("code", data["not"])])
    },
  },
  {
    alignment: "center",
    title: "Change",
    render: "change",
  },
]

const staticTableActions: TableActions<Data> = [
  {
    event: (d) => alert(`${d.this} ${d.does} ${d.not}${d.change}`),
    icon: SpeakerphoneIcon,
    label: "",
  },
  {
    event: (d) => {
      const index = staticData.value.findIndex((i) => {
        return i.this === d.this
      })

      staticData.value.splice(index, 1)
    },
    icon: TrashIcon,
    label: "",
    enable: computed(() => {
      return staticData.value.length > 1
    }),
  },
]

const staticTableProps = [
  { name: "tableData", required: true, type: "TableTypes.Static" },
]
const dynamicTableColumns: TableColumns = [
  {
    title: "Title",
    render: "title",
  },
  {
    title: "Type",
    render: "type",
  },
  {
    title: "Started On",
    render: (row) => {
      return new Date(row.created_at * 1000).toLocaleString()
    },
  },
]

const dynamicTableOptions: DynamicTableOptions = {
  refreshTrigger: 0,
  url: "https://my-json-server.typicode.com/xy-planning-network/trees/things",
}

const tableCopy = `<Table :table-data="tableData" />`
const tableProps = [
  { name: "clickable", required: false, type: "boolean" },
  { name: "loader", required: false, type: "boolean" },
  { name: "tableData", required: true, type: "TableTypes.Dynamic" },
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
              :table-columns="staticTableColumns"
              :table-data="staticData"
              :table-actions="staticTableActions"
              table-actions-type="buttons"
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
              :clickable="false"
              :table-columns="dynamicTableColumns"
              :table-options="dynamicTableOptions"
              :table-actions="staticTableActions"
            />
            <PropsTable :props="tableProps" />
          </div>
        </div>
      </ComponentLayout>
    </div>
  </div>
</template>
