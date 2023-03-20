<script lang="ts">
declare global {
  interface Window {
    Prism: {
      highlightAll: () => void
    }
  }
}
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue"
import {
  CollectionIcon,
  ColorSwatchIcon,
  DocumentTextIcon,
  HomeIcon,
  LocationMarkerIcon,
  PencilAltIcon,
  TableIcon,
  UserGroupIcon,
} from "@heroicons/vue/outline"
import Elements from "./content/Elements.vue"
import Forms from "./content/Forms.vue"
import Home from "./content/Home.vue"
import Lists from "./content/Lists.vue"
import Navigation from "./content/Navigation.vue"
import Overlays from "./content/Overlays.vue"
import Team from "./content/Team.vue"
import Tools from "./content/Tools.vue"
import TreeIcon from "./assets/trees-square-icon.svg"

const currentPage = ref("Home")
const currentNav = ref("StackedLayout")
const navigation = [
  { name: "Home", url: "/trees/?page=Home", icon: HomeIcon },
  { name: "Forms", url: "/trees/?page=Forms", icon: DocumentTextIcon },
  {
    name: "Navigation",
    url: "/trees/?page=Navigation",
    icon: LocationMarkerIcon,
  },
  { name: "Lists", url: "/trees/?page=Lists", icon: TableIcon },
  { name: "Overlays", url: "/trees/?page=Overlays", icon: CollectionIcon },
  { name: "Elements", url: "/trees/?page=Elements", icon: ColorSwatchIcon },
  { name: "Tools", url: "/trees/?page=Additional Tools", icon: PencilAltIcon },
  { name: "Team", url: "/trees/?page=Team", icon: UserGroupIcon },
]
const user = ref({
  accountID: 1,
  accountOwner: true,
  archived: true,
  id: 1000,
  name: "Jimothy Bobbitz",
  email: "jimothy@bobbitz.biz",
})
const userNavigation = ref([{ name: "Toggle the Nav", url: "/no" }])
const goTo = function (page: string): void {
  const url = "/trees/?page=" + page
  window.history.pushState({}, "", url)
  currentPage.value = page
}

const showing = function (page: string): boolean {
  return page === currentPage.value
}

const currentPageURL = computed((): string => {
  return "/trees/?page=" + currentPage.value
})

onMounted(() => {
  const page = new URLSearchParams(window.location.search).get("page")
  if (page) currentPage.value = page
  const search = new URLSearchParams(window.location.search).get("currentNav")
  if (search) currentNav.value = search

  nextTick(() => window.Prism.highlightAll())
})

watch(currentPage, () => {
  nextTick(() => window.Prism.highlightAll())
})
</script>

<template>
  <div id="app">
    <Home v-if="showing('Home')" @update="goTo" />
    <component
      v-else
      :is="currentNav"
      :activeURL="currentPageURL"
      :current-user="user"
      iconURL="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
      :navigation="navigation"
      :user-navigation="userNavigation"
    >
      <Forms v-if="showing('Forms')" />
      <Navigation v-if="showing('Navigation')" :user="user" />
      <Lists v-if="showing('Lists')" :user="user" />
      <Overlays v-if="showing('Overlays')" />
      <Elements v-if="showing('Elements')" />
      <Tools v-if="showing('Additional Tools')" />
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

      <template v-if="currentNav === 'SidebarLayout'" #sidebar-bottom>
        <div class="bg-gray-50 rounded-md p-4 space-y-3">
          <div class="flex space-x-2 items-center">
            <div class="h-14 w-14">
              <img :src="TreeIcon" />
            </div>
            <h5 class="h5 leading-tight flex-1">
              Thought Experiment Of The Day
            </h5>
          </div>
          <p class="text-sm font-medium italic">
            If a tree falls in a forest and no one is around to hear it, does it
            make a sound?
          </p>
        </div>
      </template>
    </component>
  </div>
</template>
