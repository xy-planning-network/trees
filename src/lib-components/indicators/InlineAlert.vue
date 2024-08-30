<script setup lang="ts">
import { computed, ref } from "vue"

import {
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationIcon,
  XCircleIcon,
} from "@heroicons/vue/solid"

import { XIcon } from "@heroicons/vue/outline"

const props = withDefaults(
  defineProps<{
    btnLink?: string
    btnText?: string
    content: string | string[]
    dismissable?: boolean
    secondaryBtnLink?: string
    secondaryBtnText?: string
    title?: string
    kind: "alert" | "warn" | "info" | "success"
  }>(),
  {
    btnLink: "",
    btnText: "",
    dismissable: false,
    secondaryBtnLink: "",
    secondaryBtnText: "",
    title: "",
  }
)

const emit = defineEmits<{
  close: [closed: true]
  click: [e: Event]
  "click:secondary": [e: Event]
}>()

const visible = ref(true)
const close = () => {
  visible.value = false
  emit("close", true)
}

const display = computed(() => {
  const display = {
    bgColor: "",
    btnAction: "",
    btnClose: "",
    contentColor: "",
    iconColor: "",
  }

  switch (props.kind) {
    case "alert":
      display.bgColor = "bg-red-50"
      display.btnAction =
        "bg-red-50 text-red-900 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50"
      display.btnClose =
        "bg-red-50 text-red-600 hover:bg-red-100 focus:ring-red-600 focus:ring-offset-red-50"
      display.contentColor = "text-red-800"
      display.iconColor = "text-red-400"
      break
    case "info":
      display.bgColor = "bg-blue-50"
      display.btnAction =
        "bg-blue-50 text-blue-900 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50"
      display.btnClose =
        "bg-blue-50 text-blue-600 hover:bg-blue-100 focus:ring-blue-600 focus:ring-offset-blue-50"
      display.contentColor = "text-blue-800"
      display.iconColor = "text-blue-400"
      break
    case "success":
      display.bgColor = "bg-emerald-50"
      display.btnAction =
        "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 focus:ring-emerald-600 focus:ring-offset-emerald-50"
      display.btnClose =
        "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 focus:ring-emerald-600 focus:ring-offset-emerald-50"
      display.contentColor = "text-emerald-800"
      display.iconColor = "text-emerald-400"
      break
    case "warn":
      display.bgColor = "bg-amber-50"
      display.btnAction =
        "bg-amber-50 text-amber-900 hover:bg-amber-100 focus:ring-amber-600 focus:ring-offset-amber-50"
      display.btnClose =
        "bg-amber-50 text-amber-600 hover:bg-amber-100 focus:ring-amber-600 focus:ring-offset-amber-50"
      display.contentColor = "text-amber-800"
      display.iconColor = "text-amber-400"
      break
  }

  return display
})

const icon = computed(() => {
  let icon = null
  switch (props.kind) {
    case "alert":
      icon = XCircleIcon
      break
    case "info":
      icon = InformationCircleIcon
      break
    case "success":
      icon = CheckCircleIcon
      break
    case "warn":
      icon = ExclamationIcon
      break
  }

  return icon
})
</script>

<template>
  <div v-if="visible" class="rounded-xy p-4" :class="display.bgColor">
    <div class="flex">
      <div class="flex-shrink-0">
        <component
          :is="icon"
          class="h-5 w-5"
          :class="display.iconColor"
          aria-hidden="true"
        />
      </div>
      <div class="ml-2.5">
        <h3
          v-if="title"
          class="text-sm leading-snug font-semibold mb-1.5"
          :class="display.contentColor"
        >
          {{ title }}
        </h3>

        <div class="text-sm" :class="display.contentColor">
          <ul
            v-if="Array.isArray(content)"
            role="list"
            class="list-disc space-y-1 pl-5"
          >
            <li v-for="(item, index) in content" :key="index">{{ item }}</li>
          </ul>
          <p v-else>{{ content }}</p>
        </div>

        <div v-if="btnText || secondaryBtnText" class="mt-4">
          <div
            class="flex flex-col gap-y-1.5 -mx-2 sm:flex-row sm:gap-x-3 sm:items-center"
          >
            <div v-if="btnText">
              <a
                class="inline-flex rounded-3xl px-2.5 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
                :class="display.btnAction"
                :href="btnLink"
                :role="btnLink ? 'link' : 'button'"
                @click="$emit('click', $event)"
              >
                {{ btnText }}
              </a>
            </div>
            <div v-if="secondaryBtnText">
              <a
                class="inline-flex rounded-3xl px-2.5 py-1.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
                :class="display.btnAction"
                :href="secondaryBtnLink"
                :role="secondaryBtnLink ? 'link' : 'button'"
                @click="$emit('click:secondary', $event)"
              >
                {{ secondaryBtnText }}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div v-if="dismissable" class="ml-auto pl-3">
        <div class="-mx-1.5 -my-1.5">
          <button
            class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="display.btnClose"
            type="button"
            @click="close"
          >
            <span class="sr-only">close</span>
            <XIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
