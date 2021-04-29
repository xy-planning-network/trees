<template>
  <div id="app">
    <Layout
      activeURL="#current"
      iconURL="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
      :navigation="navigation"
      :user-navigation="userNavigation"
    >
      <template v-slot:header>Dashboard</template>
      <p>im some content</p>
    </Layout>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import {
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
} from "@heroicons/vue/outline";

export default class Serve extends Vue {
  navigation = [
    { name: "Dashboard", url: "#current", icon: HomeIcon },
    { name: "Team", url: "#", icon: UsersIcon },
    { name: "Projects", url: "#", icon: FolderIcon },
    { name: "Calendar", url: "#", icon: CalendarIcon },
    { name: "Documents", url: "#", icon: InboxIcon },
    { name: "Reports", url: "#", icon: ChartBarIcon },
  ];
  userNavigation = [
    { name: "Your Profile", url: "#" },
    { name: "Settings", url: "#" },
    { name: "Sign out", url: "#" },
  ];
}
</script>
