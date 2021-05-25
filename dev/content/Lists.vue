<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <ComponentLayout title="Detail List">
        <template v-slot:description>
          This relies primarily on slots to determine the content and actions
          that can be taken on an item.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="detailListCopy" />
          </label>
          <div class="mt-1">
            <!-- <ActionsDropdown
              :current-user="user"
              :items="menuItems"
              props-data="something"
            /> -->
            <DetailList
              title="List of Things"
              url="https://jsonplaceholder.typicode.com/todos"
            >
              stuff here
            </DetailList>
            <PropsTable :props="detailListProps" />
          </div>
        </div>
      </ComponentLayout>

      <!-- <ComponentLayout class="mt-8" title="Paginator">
        <template v-slot:description>
          This is used to create page numbers based on our server side paging
          implementation underneath a list of data.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="paginatorCopy" />
          </label>
          <div class="mt-1">
            <Paginator v-model="pagination" />
            <PropsTable :props="paginatorProps" />
          </div>
        </div>
      </ComponentLayout> -->

      <!-- <ComponentLayout class="mt-8" title="Tabs">
        <template v-slot:description>
          These are used to display different groups of content. It turns into a
          select on mobile.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="tabsCopy" />
          </label>
          <div class="mt-1">
            <Tabs :tabs="tabs" v-model="currentTab" />
            <div class="bg-white shadow rounded-lg px-4 py-5 sm:px-6">
              <span v-if="currentTab === 'tab1'" class="xy-badge-yellow">
                Tab 1 Content
              </span>
              <span v-else class="xy-badge-blue"> Tab 2 Content </span>
            </div>
            <PropsTable :props="tabsProps" />
          </div>
        </div>
      </ComponentLayout> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Vue } from "vue-property-decorator";
import UserTypes from "../../src/types/users";

export default class Lists extends Vue {
  @Prop({ type: Object, required: true }) user!: UserTypes.User;

  detailListCopy = `<ActionsDropdown :current-user="currentUser" :items="items" props-data="propsData" />`;
  detailListProps = [
    { name: "currentUser", required: true, type: "UserTypes.User" },
    { name: "items", required: true, type: "Array<TableTypes.MenuItem>" },
    { name: "propsData", required: true, type: "any" },
  ];
  // currentTab = "tab1";
  // menuItems = [
  //   { label: "This is an action", event: "Navigation.EmitThisEvent1" },
  //   { label: "Do this?", event: "Navigation.EmitThisEvent2" },
  //   { label: "No! Do this.", event: "Navigation.EmitThisEvent3" },
  // ];
  // pagination = { page: 1, perPage: 10, totalItems: 100, totalPages: 10 };
  // paginatorCopy = `<Paginator v-model="pagination" />`;
  // paginatorProps = [
  //   {
  //     name: "modelValue",
  //     required: true,
  //     type:
  //       "{ page: number; perPage: number; totalItems: number; totalPages: number; }",
  //   },
  // ];
  // tabs = [
  //   { label: "Tab 1", value: "tab1" },
  //   { label: "Tab 2", value: "tab2" },
  // ];
  // tabsCopy = `<Tabs :tabs="tabs" v-model="currentTab" />`;
  // tabsProps = [
  //   {
  //     name: "tabs",
  //     required: true,
  //     type: "Array<{ label: string; value: string; }>",
  //   },
  //   { name: "modelValue", required: true, type: "string" },
  // ];
}
</script>
