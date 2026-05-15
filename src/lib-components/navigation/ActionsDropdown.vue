<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue"
import { ChevronDownIcon, EllipsisVerticalIcon } from "@heroicons/vue/solid"
import { isActionItemLink, type ActionItems } from "@/composables/nav"
import { computed, useTemplateRef } from "vue"
import { useFloating, autoUpdate, autoPlacement } from "@floating-ui/vue"

const props = withDefaults(
  defineProps<{
    actions?: ActionItems
    hideOnEmpty?: boolean
    label?: string
  }>(),
  {
    actions: () => [],
    hideOnEmpty: false,
    label: "",
  }
)

const actionItems = computed(() => {
  return props.actions
    .filter((a) => a.show !== false)
    .map((a) => {
      return {
        ...a,
        disabled: a.disabled ?? false,
        kind: isActionItemLink(a) ? "link" : "button",
        show: true,
        onClick: a.onClick ? a.onClick : () => {},
      }
    })
})

const hasActions = computed(() => actionItems.value.length > 0)

const show = computed(() => {
  if (props.hideOnEmpty) {
    return hasActions.value
  }

  return true
})

// NOTE(spk): explicitly typing as useTemplateRef is unable to infer the template type.
// https://vuejs.org/guide/typescript/composition-api.html#typing-template-refs
const triggerRef = useTemplateRef<InstanceType<typeof MenuButton>>("trigger")
const wrapperRef = useTemplateRef<HTMLElement | null>("wrapper")
const { floatingStyles } = useFloating(triggerRef, wrapperRef, {
  middleware: [
    autoPlacement({
      allowedPlacements: ["bottom-end", "bottom-start"],
    }),
  ],
  strategy: "fixed",
  whileElementsMounted: autoUpdate,
})
</script>

<template>
  <Menu v-if="show" as="div" class="relative flex items-center">
    <MenuButton
      ref="trigger"
      :class="[
        label
          ? 'rounded-md px-4 py-2 border border-gray-200 shadow-sm text-gray-800'
          : 'w-8 h-8 rounded-full border border-transparent text-gray-700',
        'inline-flex items-center justify-center text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors',
      ]"
      :disabled="!hasActions"
    >
      <span :class="!label && 'sr-only'">{{ label || "Open options" }}</span>
      <component
        :is="label ? ChevronDownIcon : EllipsisVerticalIcon"
        :class="[label && '-mr-1 ml-2', 'w-5 h-5']"
        aria-hidden="true"
      />
    </MenuButton>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div ref="wrapper" class="z-[5]" :style="floatingStyles">
        <MenuItems
          class="w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
        >
          <div class="py-1">
            <template v-for="(action, idx) in actionItems" :key="idx">
              <MenuItem
                v-slot="{
                  active,
                  disabled,
                }: {
                  active: boolean
                  disabled: boolean
                }"
                :disabled="action.disabled"
                as="div"
              >
                <button
                  v-if="action.kind === 'button'"
                  type="button"
                  :disabled="disabled"
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    disabled ? 'opacity-50 cursor-not-allowed' : '',
                    'block w-full text-left px-4 py-2 text-sm font-semibold',
                  ]"
                  @click="($event) => action.onClick($event)"
                >
                  <span class="relative inline-flex items-center gap-x-1.5">
                    <component
                      :is="action.icon"
                      v-if="action.icon"
                      class="-ml-0.5 h-4 w-4 text-gray-400"
                      aria-hidden="true"
                    />
                    {{ action.label }}
                  </span>
                </button>

                <a
                  v-else
                  :class="[
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    disabled
                      ? 'opacity-50 cursor-not-allowed pointer-events-none'
                      : '',
                    'block w-full text-left px-4 py-2 text-sm font-semibold',
                  ]"
                  :href="disabled ? undefined : action.url"
                  :target="action.openInTab ? '_blank' : undefined"
                  v-bind="action.attrs"
                  @click="
                    disabled ? $event.preventDefault() : action.onClick($event)
                  "
                >
                  <span class="relative inline-flex items-center gap-x-1.5">
                    <component
                      :is="action.icon"
                      v-if="action.icon"
                      class="-ml-0.5 h-4 w-4 text-gray-400"
                      aria-hidden="true"
                    />
                    {{ action.label }}
                  </span>
                </a>
              </MenuItem>
            </template>
          </div>
        </MenuItems>
      </div>
    </transition>
  </Menu>
</template>
