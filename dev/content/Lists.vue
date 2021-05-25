<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <ComponentLayout title="Detail List">
        <template v-slot:description>
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
              <template v-slot:default="props">
                <div class="block cursor-pointer hover:bg-gray-50">
                  <div class="px-4 py-4 sm:px-6">
                    <div class="flex items-center justify-between">
                      <p class="text-sm font-medium text-indigo-600 truncate">
                        {{ props.item.title }}
                      </p>
                      <div class="ml-2 flex-shrink-0 flex">
                        <p
                          class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                          v-text="props.item.title"
                        ></p>
                      </div>
                    </div>
                    <div class="mt-2 sm:flex sm:justify-between">
                      <div class="sm:flex">
                        <p class="flex items-center text-sm text-gray-500">
                          <UsersIcon
                            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          {{ props.item.type }}
                        </p>
                        <p
                          class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6"
                        >
                          <LocationMarkerIcon
                            class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                          Remote
                        </p>
                      </div>
                      <div
                        class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0"
                      >
                        <CalendarIcon
                          class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <p>
                          Started on
                          {{ " " }}
                          <time :datetime="props.item.created_at">{{
                            new Date(
                              props.item.created_at * 1000
                            ).toLocaleString()
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

      <ComponentLayout class="mt-8" title="Table">
        <template v-slot:description>
          This bakes a table into simple column definitions. This can be
          combined with the ActionsDropdown for lots of nifty functionality.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="tableCopy" />
          </label>
          <div class="mt-1">
            <Table :table-data="tableData" />
            <PropsTable :props="tableProps" />
          </div>
        </div>
      </ComponentLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";
import {
  CalendarIcon,
  LocationMarkerIcon,
  UsersIcon,
} from "@heroicons/vue/solid";
import UserTypes from "../../src/types/users";

@Options({ components: { CalendarIcon, LocationMarkerIcon, UsersIcon } })
export default class Lists extends Vue {
  @Prop({ type: Object, required: true }) user!: UserTypes.User;

  detailListCopy = `<DetailList title="Things" url="/things"></DetailList>`;
  detailListProps = [
    { name: "refreshTrigger", required: false, type: "number" },
    { name: "reloadTrigger", required: false, type: "number" },
    { name: "title", required: true, type: "string" },
    { name: "url", required: true, type: "string" },
  ];
  tableData = {
    currentUser: this.user,
    columns: [
      {
        display: "Title",
        key: "title",
      },
      {
        display: "Type",
        key: "type",
      },
      {
        display: "Started On",
        presenter: (row: { created_at: number }): string => {
          return new Date(row.created_at * 1000).toLocaleString();
        },
      },
    ],
    refreshTrigger: 0,
    url: "https://my-json-server.typicode.com/xy-planning-network/trees/things",
  };
  tableCopy = `<Table :table-data="tableData" />`;
  tableProps = [{ name: "tableData", required: true, type: "TableTypes.Data" }];
}
</script>
