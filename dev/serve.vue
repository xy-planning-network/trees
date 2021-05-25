<template>
  <div id="app">
    <div
      class="relative bg-white py-16 sm:py-24 lg:py-32"
      v-if="showing('Home')"
    >
      <div
        class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl"
      >
        <h2
          class="text-base font-semibold tracking-wider text-blue-600 uppercase"
        >
          Build faster with consistency
        </h2>
        <p
          class="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl"
        >
          XY Technology UI Kit
        </p>
        <p class="mt-5 max-w-prose mx-auto text-xl text-gray-500">
          Everything you need to build your app. Get excited!
        </p>

        <Features @update:modelValue="goTo" />
        <Quotes />
      </div>
    </div>
    <component
      :is="currentNav"
      :activeURL="currentPageURL"
      :current-user="user"
      iconURL="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
      :navigation="navigation"
      :user-navigation="userNavigation"
      v-else
    >
      <Forms v-if="showing('Forms')" />
      <Navigation v-if="showing('Navigation')" :user="user" />
      <Lists v-if="showing('Lists')" />
      <button
        type="button"
        class="xy-btn"
        @click="
          currentNav =
            currentNav === 'StackedLayout' ? 'SidebarLayout' : 'StackedLayout'
        "
      >
        Swap Dat Nav
      </button>
    </component>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-property-decorator";
import {
  DocumentTextIcon,
  HomeIcon,
  LocationMarkerIcon,
  TableIcon,
} from "@heroicons/vue/outline";
import Features from "./content/Features.vue";
import Forms from "./content/Forms.vue";
import Lists from "./content/Lists.vue";
import Navigation from "./content/Navigation.vue";
import Quotes from "./content/Quotes.vue";

@Options({ components: { Features, Forms, Lists, Navigation, Quotes } })
export default class Serve extends Vue {
  currentPage = "Home";
  currentNav = "StackedLayout";
  navigation = [
    { name: "Home", url: "/?page=Home", icon: HomeIcon },
    { name: "Forms", url: "/?page=Forms", icon: DocumentTextIcon },
    { name: "Navigation", url: "/?page=Navigation", icon: LocationMarkerIcon },
    { name: "Lists", url: "/?page=Lists", icon: TableIcon },
  ];
  user = { name: "Jimothy Bobbitz", email: "jimothy@bobbitz.biz" };
  userNavigation = [{ name: "Toggle the Nav", url: "/no" }];
  toggle = true;
  open = true;

  mounted() {
    const page = new URLSearchParams(window.location.search).get("page");
    if (page) this.currentPage = page;
    const currentNav = new URLSearchParams(window.location.search).get(
      "currentNav"
    );
    if (currentNav) this.currentNav = currentNav;
  }

  goTo(page: string): void {
    const url = "/?page=" + page;
    window.history.pushState({}, "", url);
    this.currentPage = page;
  }
  showing(page: string): boolean {
    return page === this.currentPage;
  }

  get currentPageURL(): string {
    return "/?page=" + this.currentPage;
  }
}
</script>
