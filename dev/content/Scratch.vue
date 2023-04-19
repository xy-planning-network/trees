<script setup lang="ts">
import { computed, ref } from "vue"
import type { ActionMenuEmit } from "@/composables/nav"
import type { ActionMenuItemCallback } from "@/composables/nav"
import ActionsDropdownEmit from "@/lib-components/navigation/ActionsDropdownEmit.vue"
import ActionsDropdownCallback from "@/lib-components/navigation/ActionsDropdownCallback.vue"
import things from "../../db.json"

const showAlert = ref(true)

const treesList = things.conifers.data.items
type Tree = (typeof treesList)[number]

const alert = (tree: Tree) => {
  window.alert(JSON.stringify(tree))
}

const toggleAlert = () => {
  showAlert.value = !showAlert.value
}

const logTree = (tree: Tree) => {
  console.log(tree)
}

const actionEmits: ActionMenuEmit[] = [
  {
    id: "alert",
    label: "Alert",
    show: showAlert,
  },
  {
    id: "toggle",
    label: "Toggle Alert",
    show: computed(() => {
      return true
    }),
  },
  {
    id: "console",
    label: "Console Log",
    show: true,
  },
]

const actionEmitClick = (id: string) => {
  switch (id) {
    case "alert":
      alert(treesList[0])
      break
    case "toggle":
      toggleAlert()
      break
    case "console":
      logTree(treesList[0])
      break
  }
}

const actionCallback: ActionMenuItemCallback[] = [
  {
    callback: () => alert(treesList[0]),
    label: "Alert",
    show: showAlert,
  },
  {
    callback: toggleAlert,
    label: "Toggle Alert",
    show: computed(() => {
      return true
    }),
  },
  {
    callback: () => logTree(treesList[0]),
    label: "Console Log",
    show: () => true,
  },
]
</script>

<template>
  <div class="container mx-auto space-y-6">
    <div>
      <h3>ActionsDropdownEmit</h3>
      <ActionsDropdownEmit :items="actionEmits" @click="actionEmitClick" />
    </div>
    <div>
      <h3>ActionsDropdownCallback</h3>
      <ActionsDropdownCallback :items="actionCallback" />
    </div>
  </div>
</template>
