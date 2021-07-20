<template>
  <div>
    <div
      class="flex flex-col mb-4 space-y-4 lg:space-y-0 lg:flex-row lg:justify-between"
    >
      <div class="w-full max-w-lg lg:max-w-xs" v-if="tableData.search">
        <label for="search" class="sr-only">Search</label>
        <div class="relative">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"
          >
            <svg
              class="w-5 h-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <input
            class="pl-10"
            type="search"
            v-model.trim="query"
            placeholder="Search"
            @change="reloadTable()"
          />
        </div>
      </div>
      <div class="w-full max-w-lg lg:max-w-xs" v-if="tableData.dateSearch">
        <DateRangePicker
          v-model="dateRange"
          @update:modelValue="dateRangeChanged"
        />
      </div>
    </div>

    <div
      class="relative z-0 min-w-full align-middle border-b border-gray-200 shadow sm:rounded-lg overflow-x-auto"
    >
      <table class="min-w-full">
        <thead>
          <tr>
            <th
              class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50 leading-4"
              v-for="(col, idx) in tableData.columns"
              :key="idx"
            >
              <span v-if="!!col.display.length">{{ col.display }}</span>
              <span
                class="cursor-pointer"
                @click.prevent="handleSort(col.sort)"
                v-if="col.sort"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="h-5 inline"
                  v-if="currentSort !== col.sort"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-5 inline"
                  v-else-if="currentSortDirection == 'desc'"
                >
                  <path
                    fill-rule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  class="h-5 inline"
                  v-else
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </span>
            </th>
          </tr>
        </thead>

        <tbody class="bg-white">
          <tr
            v-for="(item, rowIdx) in items"
            :key="item.id ? item.id : rowIdx"
            @click="$emit('handleClick', item)"
            :class="{ 'cursor-pointer': clickable }"
          >
            <td
              class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap border-b border-gray-200 leading-5"
              v-for="(col, colIdx) in tableData.columns"
              :key="rowIdx + '-' + colIdx"
              :class="col.class"
            >
              <component
                :is="col.component"
                v-if="col.component"
                :props-data="item"
                :current-user="tableData.currentUser"
                :attribute="col.key"
                :items="col.items"
              ></component>
              <div v-else v-text="cellValue(item, col)"></div>
            </td>
          </tr>

          <tr v-if="!hasContent">
            <td
              :colspan="tableData.columns.length"
              class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap border-b border-gray-200 leading-5"
            >
              No items were found!
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Paginator
      v-model="pagination"
      @update:modelValue="loadAndRender(false)"
      v-if="hasContent"
    />
  </div>
</template>

<script lang="ts">
import { Options, Prop, Watch, Vue } from "vue-property-decorator";
import { AxiosResponse } from "axios";
import DateRangePicker from "../forms/DateRangePicker.vue";
import Paginator from "../navigation/Paginator.vue";
import BaseAPI from "../../api/base";
import TableTypes from "../../types/table";

@Options({ components: { DateRangePicker, Paginator }, name: "Table" })
export default class Table extends Vue {
  @Prop({ type: Boolean, required: false, default: false }) clickable!: boolean;
  @Prop({ type: Boolean, required: false, default: true }) loader!: boolean;
  @Prop({ type: Object, required: true }) tableData!: TableTypes.Dynamic;

  currentSort = "";
  currentSortDirection = "";
  dateRange: { minDate: number; maxDate: number } = {
    minDate: 0,
    maxDate: 0,
  };
  items: any[] = [];
  pagination = {
    page: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 0,
  };
  query = "";

  @Watch("tableData.refreshTrigger")
  onRefreshTrigger(): void {
    // This lets parent components trigger a refresh of the current page depending on external actions.
    this.loadAndRender();
  }

  @Watch("tableData.reloadTrigger")
  onReloadTrigger(): void {
    // This lets parent components trigger a reload of page 1 depending on external actions.
    this.reloadTable();
  }

  created() {
    if (this.tableData.defaultSort) {
      this.currentSort = this.tableData.defaultSort;
      this.currentSortDirection = this.tableData.defaultSortDirection
        ? this.tableData.defaultSortDirection
        : "desc";
    }

    this.loadAndRender();
  }

  cellValue(item: Record<string, any>, col: TableTypes.Column): string {
    if (col.key) {
      // NOTE(dlk): supports dot notation for nested keys
      return col.key.split(".").reduce((o, i) => o[i], item as any);
    }

    if (col.presenter) {
      return col.presenter(item, this);
    }

    return "";
  }
  dateRangeChanged(dateRange: { minDate: number; maxDate: number }): void {
    this.pagination.page = 1;
    this.dateRange = dateRange;
    this.loadAndRender();
  }
  handleSort(selectedSort: string): void {
    if (this.currentSort == selectedSort) {
      this.currentSortDirection =
        this.currentSortDirection === "desc" ? "asc" : "desc";
    } else {
      this.currentSort = selectedSort;
      this.currentSortDirection = "desc";
    }

    this.loadAndRender();
  }
  loadAndRender(): void {
    const params = {
      minDate: this.dateRange.minDate,
      maxDate: this.dateRange.maxDate,
      page: this.pagination.page,
      perPage: this.pagination.perPage,
      sort: this.currentSort,
      sortDir: this.currentSortDirection,
      q: this.query,
    };

    BaseAPI.get(this.tableData.url, { skipLoader: !this.loader }, params).then(
      (success: AxiosResponse) => {
        this.pagination = {
          page: success.data.page,
          perPage: success.data.perPage,
          totalItems: success.data.totalItems,
          totalPages: success.data.totalPages,
        };
        this.items = success.data.items;
      },
      () => {
        window.VueBus.emit(
          "Flash-show-generic-error",
          "membership@xyplanningnetwork.com"
        );
      }
    );
  }
  reloadTable(): void {
    this.pagination.page = 1;
    this.loadAndRender();
  }

  get hasContent(): boolean {
    return this.items.length ? true : false;
  }
}
</script>
