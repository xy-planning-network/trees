<script lang="ts">
export type Layout = "stacked" | "centered" | "justified"
export type Variant = "neutral" | "brand"
</script>

<script setup lang="ts">
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    layout?: Layout
    upperdeck?: string
    headline?: string
    lowerdeck?: string
    support: string
    primaryButtonText?: string
    primaryButtonLink?: string
    secondaryButtonText?: string
    secondaryButtonLink?: string
    variant?: Variant
    img?: string
  }>(),
  {
    layout: "stacked",
    upperdeck: "",
    lowerdeck: "",
    headline: "",
    support: "",
    primaryButtonText: "",
    primaryButtonLink: "",
    secondaryButtonText: "",
    secondaryButtonLink: "",
    variant: "neutral",
    img: "",
  }
)

defineEmits<{
  (e: "click:primary", v: Event): void
  (e: "click:secondary", v: Event): void
}>()

const hasPrimaryCTA = computed((): boolean => {
  return props.primaryButtonLink !== "" && props.primaryButtonText !== ""
})

const hasSecondaryCTA = computed((): boolean => {
  return props.secondaryButtonLink !== "" && props.secondaryButtonText !== ""
})

const hasCTA = computed((): boolean => {
  return hasPrimaryCTA.value || hasSecondaryCTA.value
})

const isNeutral = computed((): boolean => {
  return props.variant === "neutral"
})

const isBrand = computed((): boolean => {
  return props.variant === "brand"
})

const isCentered = computed((): boolean => {
  return props.layout === "centered"
})

const isStacked = computed((): boolean => {
  return props.layout === "stacked"
})

const isJustified = computed((): boolean => {
  return props.layout === "justified"
})
</script>

<template>
  <div
    class="mx-auto flex flex-col justify-center"
    :class="{
      'bg-gray-100': isNeutral,
      'bg-xy-blue': isBrand,
    }"
  >
    <div class="container w-full max-w-7xl mx-auto">
      <div
        class="px-6 py-10 sm:py-14 lg:px-8 space-y-3"
        :class="{
          'lg:flex lg:items-center lg:justify-between lg:gap-x-3 lg:space-y-0':
            isStacked,
        }"
      >
        <div
          :class="{
            'max-w-3xl': isCentered || isStacked,
            'text-center mx-auto': isCentered,
            'lg:flex lg:items-center lg:justify-between lg:gap-x-3':
              isJustified,
          }"
        >
          <div
            :class="{
              'lg:max-w-3xl lg:flex-1': isJustified,
            }"
          >
            <h2
              v-if="upperdeck"
              class="mb-2 text-base leading-7 font-semibold"
              :class="{
                'text-gray-700': isNeutral,
                'text-white': isBrand,
              }"
            >
              {{ upperdeck }}
            </h2>
            <h3
              v-if="headline"
              class="text-3xl leading-8 font-bold sm:text-4xl sm:leading-9"
              :class="{
                'text-gray-800': isNeutral,
                'text-xy-lime': isBrand,
              }"
            >
              <span class="whitespace-pre-wrap">{{ headline }}</span>
            </h3>
            <p
              v-if="lowerdeck"
              class="mt-5 text-xl sm:text-2xl leading-8"
              :class="{
                'font-semibold text-xy-blue': isNeutral,
                'font-semibold text-white': isBrand,
              }"
            >
              <span class="whitespace-pre-wrap">{{ lowerdeck }}</span>
            </p>
            <p
              v-if="support"
              class="mt-5 text-base sm:text-lg leading-7"
              :class="{
                'text-gray-700': isNeutral,
                'font-medium text-white': isBrand,
              }"
            >
              {{ support }}
            </p>
          </div>
          <div
            v-if="hasCTA"
            class="flex flex-col gap-6 sm:flex-row sm:items-center mt-8"
            :class="{
              'justify-center': isCentered,
              'lg:mt-0 lg:shrink-0': isJustified,
            }"
          >
            <a
              v-if="hasPrimaryCTA"
              :href="primaryButtonLink"
              :class="{
                'xy-btn': isNeutral,
                'xy-btn-green': isBrand,
              }"
              @click="$emit('click:primary', $event)"
            >
              {{ primaryButtonText }}
            </a>
            <a
              v-if="hasSecondaryCTA"
              :href="secondaryButtonLink"
              :class="{
                'xy-btn-text-secondary': isNeutral,
                'xy-btn-text-white': isBrand,
              }"
              @click="$emit('click:secondary', $event)"
            >
              {{ secondaryButtonText }}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div v-if="img && isStacked" class="shrink-0 max-w-xs mx-auto">
          <img :src="img" role="presentation" />
        </div>
      </div>
    </div>
  </div>
</template>
