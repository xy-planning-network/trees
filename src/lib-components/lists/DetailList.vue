<template>
  <div>
    <DateFilter
      :date-range="dateRange"
      :sort-dir="sortDir"
      :title="title"
      @sort-dir-changed="sortDir = $event"
      @date-range-changed="dateRange = $event"
    />

    <div class="shadow overflow-hidden sm:rounded-md border" v-if="hasContent">
      <ul>
        <li
          v-for="(item, idx) in items"
          :key="idx"
          :class="{ 'border-t border-gray-200': idx > 0 }"
        >
          <slot :item="item"></slot>
        </li>
      </ul>
    </div>

    <slot name="empty" v-else></slot>

    <Paginator
      v-model="pagination"
      @update:modelValue="loadAndRender(false)"
      v-if="hasContent"
    />
  </div>
</template>

<script lang="ts">
import { Options, Prop, Vue, Watch } from "vue-property-decorator";
import BaseAPI from "../../api/base";
import DateFilter from "../layout/DateFilter.vue";
import Paginator from "../navigation/Paginator.vue";

@Options({ components: { DateFilter, Paginator }, name: "DetailList" })
export default class DetailList extends Vue {
  @Prop({ type: Number, required: false }) refreshTrigger?: number;
  @Prop({ type: Number, required: false }) reloadTrigger?: number;
  @Prop({ type: String, required: true }) title!: string;
  @Prop({ type: String, required: true }) url!: string;

  @Watch("sortDir")
  onSortDir(): void {
    this.loadAndRender(false);
  }

  @Watch("dateRange")
  onDateRange(): void {
    this.loadAndRender(false);
  }

  @Watch("refreshTrigger")
  onRefreshTrigger(): void {
    // This lets parent components trigger a refresh of the current page depending on external actions.
    this.loadAndRender(false);
  }

  @Watch("reloadTrigger")
  onReloadTrigger(): void {
    // This lets parent components trigger a refresh of the current page depending on external actions.
    this.pagination.page = 1;
    this.loadAndRender(true);
  }

  dateRange: { minDate: number; maxDate: number } = {
    minDate: 0,
    maxDate: 0,
  };
  hasContent = true;
  items: any[] = [];
  pagination = {
    page: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 0,
  };
  sortDir = "DESC";

  created() {
    this.loadAndRender(true);
  }

  loadAndRender(checkForContent: boolean): void {
    const params = {
      page: this.pagination.page,
      perPage: this.pagination.perPage,
      sortDir: this.sortDir,
    };

    BaseAPI.get(this.url, {}, Object.assign(params, this.dateRange)).then(
      (success: any) => {
        this.pagination = {
          page: success.data.page,
          perPage: success.data.perPage,
          totalItems: success.data.totalItems,
          totalPages: success.data.totalPages,
        };
        this.items = success.data.items;
        if (checkForContent) this.hasContent = this.items.length != 0;
      },
      () => {
        window.VueBus.emit(
          "Flash-show-generic-error",
          "archive@xyplanningnetwork.com"
        );
      }
    );
  }
}
</script>
