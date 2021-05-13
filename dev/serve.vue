<template>
  <div id="app">
    <!-- <link rel="stylesheet" href="https://rsms.me/inter/inter.css" /> -->
    <!-- <SidebarLayout
      activeURL="#current"
      iconURL="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
      :navigation="navigation"
      :user-navigation="userNavigation"
      v-if="toggle"
    >
      <template v-slot:header>Dashboard</template>
      <button type="button" class="xy-btn" @click="toggle = !toggle">
        Button text
      </button>
    </SidebarLayout>

    <StackedLayout
      activeURL="#current"
      :current-user="user"
      iconURL="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
      :navigation="navigation"
      :user-navigation="userNavigation"
      v-else
    >
      <button type="button" class="xy-btn" @click="toggle = !toggle">
        Button text
      </button>
    </StackedLayout> -->
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

        <Features v-model="currentPage" />
        <Quotes />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-property-decorator";
import {
  CalendarIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/vue/outline";
import Features from "./parts/Features.vue";
import Quotes from "./parts/Quotes.vue";

@Options({ components: { Features, Quotes } })
export default class Serve extends Vue {
  currentPage = "Home";
  navigation = [
    { name: "Dashboard", url: "#current", icon: HomeIcon },
    { name: "Team", url: "#", icon: UsersIcon },
    { name: "Projects", url: "#", icon: FolderIcon },
    { name: "Calendar", url: "#", icon: CalendarIcon },
  ];
  user = { name: "Jimogthy Bobbitz", email: "jimothy@bobbitz.biz" };
  userNavigation = [
    { name: "Your Profile", url: "#" },
    { name: "Settings", url: "#" },
    { name: "Sign out", url: "#" },
  ];
  toggle = true;
  open = true;

  showing(page: string): boolean {
    return page === this.currentPage;
  }
}
</script>
