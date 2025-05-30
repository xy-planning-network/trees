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
  DynamicTableOptions,
  TableBulkActions,
} from "@/composables/table"
import NeedleTag from "../components/NeedleTags.vue"
import { conifers } from "../../db.json"
import { Conifer } from "../domain/tree"
import { useAppFlasher, useAppSpinner } from "@/composables"

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
const detailListCopy = `<DetailList url="things"></DetailList>`
const detailListProps = [
  { name: "url", required: true, type: "string" },
  { name: "borderless", required: false, type: "boolean" },
  { name: "defaultSort", required: false, type: "string" },
  { name: "defaultSortDir", required: false, type: "SortDir" },
  { name: "disableDate", required: false, type: "boolean" },
  { name: "disableNavigation", required: false, type: "boolean" },
  { name: "perPage", required: false, type: "number" },
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
  {
    title: "Hidden Column",
    render: () => "-",
    show: false,
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

const dynamicTableBulkActions: TableBulkActions<Conifer> = {
  actions: [
    {
      label: "Remove",
      onClick: (ids, _, table) => {
        const doit = confirm(`Remove these items? [${ids.join(",")}]`)

        if (doit) {
          table.refresh()
        }

        table.clearSelection()
      },
      show: true,
    },
    {
      label: "Update",
      onClick: (_, data, table) => {
        useAppSpinner.show()

        const promises: Promise<void>[] = []
        data.forEach((data, index) => {
          promises.push(
            new Promise((resolve) => {
              setTimeout(() => {
                useAppFlasher.info(`Updating ${data.name}!`)
                resolve()
              }, index * 1000)
            })
          )
        })

        Promise.all(promises).then(() => {
          useAppSpinner.hide()
          table.clearSelection()
          table.refresh()
        })
      },
    },
    {
      label: "Disabled",
      disabled: true,
      onClick: () => {},
    },
    {
      label: "Hidden",
      onClick: () => {},
      show: false,
    },
  ],
  isSelectable: (d) => {
    return d.leaf.type !== "Scale-leaf"
  },
}

const dynamicTableOptions: DynamicTableOptions = {
  dateSearch: true,
  refreshTrigger: 0,
  search: true,
  url: "https://my-json-server.typicode.com/xy-planning-network/trees/conifers",
}

const tableCopy = `<DynamicTable :table-columns="tableColumns" :table-options="tableOptions" />`
const tableProps = [
  { name: "tableActions", required: false, type: "TableActions<T>" },
  { name: "tableColumns", required: true, type: "TableColumns<T>" },
  { name: "tableOptions", required: true, type: "DynamicTableOptions" },
]

const dynamictableProps = [
  ...tableProps,
  { name: "tableBulkActions", required: false, type: "TableBulkActions<T>" },
]
</script>
<template>
  <div class="docs-page-wrapper">
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

    <ComponentLayout title="Detail List">
      <template #description>
        This relies primarily on slots to determine the content and actions that
        can be taken on an item. It primarily handles pagination, fetching new
        data, sorting, and filtering. The UI needs to be built out in the slot.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="detailListCopy" />
        </label>
        <div class="mt-1">
          <DetailList
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

    <ComponentLayout title="Static Table">
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

    <ComponentLayout title="Table">
      <template #description>
        This bakes a table into simple column definitions. This can be combined
        with the ActionsDropdown for lots of nifty functionality.
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
          />
          <PropsTable :props="dynamictableProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Table with Bulk Actions">
      <template #description
        >Individual row ActionsDropdown's can also be combined with bulk actions
        applied against multiple row selections.</template
      >

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="tableCopy" />
        </label>
        <div class="mt-1">
          <DynamicTable
            :table-columns="tableColumns"
            :table-options="dynamicTableOptions"
            :table-actions="dynamicTableActions"
            :table-bulk-actions="dynamicTableBulkActions"
          />
          <PropsTable :props="dynamictableProps" />
        </div>
      </div>
    </ComponentLayout>
  </div>
</template>
