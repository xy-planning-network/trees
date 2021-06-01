<template>
  <div id="app">
    <Home v-if="showing('Home')" @update="goTo" />
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
      <Lists v-if="showing('Lists')" :user="user" />
      <Overlays v-if="showing('Overlays')" />
      <Elements v-if="showing('Elements')" />
      <Team v-if="showing('Team')" />
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
  CollectionIcon,
  ColorSwatchIcon,
  DocumentTextIcon,
  HomeIcon,
  LocationMarkerIcon,
  TableIcon,
  UserGroupIcon,
} from "@heroicons/vue/outline";
import Elements from "./content/Elements.vue";
import Forms from "./content/Forms.vue";
import Home from "./content/Home.vue";
import Lists from "./content/Lists.vue";
import Navigation from "./content/Navigation.vue";
import Overlays from "./content/Overlays.vue";
import Team from "./content/Team.vue";

@Options({
  components: {
    Elements,
    Forms,
    Home,
    Lists,
    Navigation,
    Overlays,
    Team,
  },
  name: "Serve",
})
export default class Serve extends Vue {
  currentPage = "Home";
  currentNav = "StackedLayout";
  navigation = [
    { name: "Home", url: "/?page=Home", icon: HomeIcon },
    { name: "Forms", url: "/?page=Forms", icon: DocumentTextIcon },
    { name: "Navigation", url: "/?page=Navigation", icon: LocationMarkerIcon },
    { name: "Lists", url: "/?page=Lists", icon: TableIcon },
    { name: "Overlays", url: "/?page=Overlays", icon: CollectionIcon },
    { name: "Elements", url: "/?page=Elements", icon: ColorSwatchIcon },
    { name: "Team", url: "/?page=Team", icon: UserGroupIcon },
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
