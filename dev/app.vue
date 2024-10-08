<script setup lang="ts">
import { homePage, pages } from "./pages"
import { user } from "./domain/user"
import { ref } from "vue"
import logo from "./assets/xypn-logo-mark.png?url"

/**
 * determine the app layout on load
 */
const appLayout = (() => {
  const key = "trees-app-layout"
  const layout = new URLSearchParams(window.location.search).get("layout")
  if (layout) {
    window.localStorage.setItem(key, layout)
  }

  return window.localStorage.getItem(key) || "StackedLayout"
})()

/**
 * determine the current page to render
 */
const currentPage = (() => {
  const pageId = new URLSearchParams(window.location.search).get("page")
  if (!pageId) {
    return homePage
  }

  const page = pages.find((p) => p.name === pageId)
  return page || null
})()

/**
 * set the current page url for the app layout primary nav
 */
const currentPageURL = currentPage?.url || ""

/**
 * determine the page component to render in the app layout
 */
const appComponent = currentPage?.component || null

/**
 * add a user nav that allows toggling the app layout
 */
const userNavigation = (() => {
  const toggle =
    appLayout === "SidebarLayout" ? "StackedLayout" : "SidebarLayout"
  const url = new URL(currentPageURL || homePage.url, window.location.origin)
  url.searchParams.set("layout", toggle)

  return [
    {
      name: "Toggle the Nav",
      url: url.toString(),
    },
  ]
})()

/**
 * App Sidebar Nav Slot Demo
 */
const showProgress = ref(false)
const currentStep = ref(2)
const steps = [
  { name: "Sign Up" },
  {
    name: "Verify Email",
  },
  {
    name: "Set Up Profile",
  },
  {
    name: "Choose a Plan",
  },
  {
    name: "Review and Submit",
  },
]
</script>

<template>
  <div id="app">
    <component
      :is="appLayout"
      :active-url="currentPageURL"
      :current-user="user"
      :icon-url="logo"
      :navigation="[homePage, ...pages]"
      :user-navigation="userNavigation"
    >
      <div class="container py-10 px-4 md:px-6 xl:px-10 xl:max-w-screen-xl">
        <component :is="appComponent" v-if="appComponent" :user="user" />
        <div v-else class="prose prose-lg">
          <h1>404</h1>
          <p>Oops! No page component to render...</p>
        </div>
      </div>

      <template
        v-if="appLayout === 'SidebarLayout' && showProgress"
        #sidebar-nav
      >
        <div class="flex justify-center px-2 py-6">
          <ProgressCirclesLabeled :current="currentStep" :steps="steps" />
        </div>
      </template>

      <template v-if="appLayout === 'SidebarLayout'" #sidebar-bottom>
        <button
          v-if="!showProgress"
          class="xy-btn w-full"
          @click="showProgress = true"
        >
          Show Progress
        </button>
        <button
          v-if="showProgress"
          class="xy-btn w-full"
          @click="showProgress = false"
        >
          Show Navigation
        </button>
      </template>
    </component>
  </div>
</template>
