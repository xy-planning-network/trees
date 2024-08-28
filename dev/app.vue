<script setup lang="ts">
import { homePage, pages } from "./pages"
import TreeIcon from "./assets/trees-square-icon.svg"
import { user } from "./domain/user"

/**
 * determine the app layout on load
 */
const appLayout = (() => {
  const key = "trees-app-layout"
  const layout = new URLSearchParams(window.location.search).get("layout")
  if (layout) {
    window.localStorage.setItem(key, layout)
  }

  return window.localStorage.getItem(key) || "SidebarLayout"
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
</script>

<template>
  <div id="app">
    <component
      :is="appLayout"
      :active-url="currentPageURL"
      :current-user="user"
      icon-url="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg"
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

      <template v-if="appLayout === 'SidebarLayout'" #sidebar-bottom>
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
