<script lang="ts" setup>
import { ActionItems, isActionItemButton } from "@/composables/nav"
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    actions?: ActionItems
  }>(),
  {
    actions: () => [],
  }
)

const actionItems = computed(() => {
  return props.actions
    .filter((a) => a.show !== false)
    .map((a) => {
      return {
        ...a,
        disabled: a.disabled ?? false,
        kind: isActionItemButton(a) ? "button" : "link",
        show: true,
        onClick: a.onClick ? a.onClick : () => {},
      }
    })
})

const hasActions = computed(() => actionItems.value.length > 0)
</script>

<template>
  <div v-if="hasActions" class="flex items-center space-x-2">
    <span class="isolate inline-flex rounded-md shadow-sm">
      <template v-for="(action, actionIdx) in actionItems" :key="actionIdx">
        <button
          v-if="action.kind === 'button'"
          type="button"
          class="group relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10 disabled:text-gray-400 disabled:cursor-not-allowed"
          :class="{
            'rounded-l-md': actionIdx === 0,
            '-ml-px': actionIdx > 0,
            'rounded-r-md': actionIdx === actionItems.length - 1,
          }"
          :disabled="action.disabled"
          @click.stop="action.onClick"
        >
          <span class="relative inline-flex items-center gap-x-1.5">
            <component
              :is="action.icon"
              v-if="action.icon"
              class="-ml-0.5 h-4 w-4 group-disabled:text-gray-300"
              :class="action.label ? 'text-gray-400' : 'text-gray-600'"
              aria-hidden="true"
            />
            {{ action.label }}
          </span>
        </button>

        <a
          v-else
          :href="action.disabled ? undefined : action.url"
          class="group relative inline-flex items-center bg-white px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-10"
          :class="[
            {
              'rounded-l-md': actionIdx === 0,
              '-ml-px': actionIdx > 0,
              'rounded-r-md': actionIdx === actionItems.length - 1,
            },
            action.disabled
              ? 'text-gray-400 cursor-not-allowed pointer-events-none'
              : 'text-gray-700 hover:bg-gray-50',
          ]"
          :target="action.openInTab ? '_blank' : undefined"
          v-bind="action.attrs"
          @click.stop="
            action.disabled ? $event.preventDefault() : action.onClick($event)
          "
        >
          <span class="relative inline-flex items-center gap-x-1.5">
            <component
              :is="action.icon"
              v-if="action.icon"
              class="-ml-0.5 h-4 w-4"
              :class="[
                action.label ? 'text-gray-400' : 'text-gray-600',
                action.disabled ? 'text-gray-300' : '',
              ]"
              aria-hidden="true"
            />
            {{ action.label }}
          </span>
        </a>
      </template>
    </span>
  </div>
</template>
