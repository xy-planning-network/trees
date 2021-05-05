<template>
  <div id="app">
    <SidebarLayout
      activeURL="#current"
      iconURL="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
      :navigation="navigation"
      :user-navigation="userNavigation"
      v-if="toggle"
    >
      <template v-slot:header>Dashboard</template>
      <button
        type="button"
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        @click="toggle = !toggle"
      >
        Button text
      </button>
    </SidebarLayout>

    <StackedLayout
      activeURL="#current"
      iconURL="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
      :navigation="navigation"
      :user-navigation="userNavigation"
      v-else
    >
      <button
        type="button"
        class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        @click="toggle = !toggle"
      >
        Button text
      </button>
    </StackedLayout>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import {
  CalendarIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "@heroicons/vue/outline";

export default class Serve extends Vue {
  navigation = [
    { name: "Dashboard", url: "#current", icon: HomeIcon },
    { name: "Team", url: "#", icon: UsersIcon },
    { name: "Projects", url: "#", icon: FolderIcon },
    { name: "Calendar", url: "#", icon: CalendarIcon },
  ];
  userNavigation = [
    { name: "Your Profile", url: "#" },
    { name: "Settings", url: "#" },
    { name: "Sign out", url: "#" },
  ];
  toggle = true;
}
</script>
