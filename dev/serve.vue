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
  user = { name: "Jimogthy Bobbitz", email: "jimothy@bobbitz.biz" };
  userNavigation = [
    { name: "Your Profile", url: "#" },
    { name: "Settings", url: "#" },
    { name: "Sign out", url: "#" },
  ];
  toggle = true;
  open = true;
}
</script>
