<script lang="ts" setup>
import { computed } from "vue"

const props = withDefaults(
  defineProps<{
    start?: boolean
    span: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  }>(),
  {
    start: false,
  }
)

const classname = computed(() => {
  let classname = ""
  switch (props.span) {
    case "xs":
      classname = "sm:col-span-2"
      break
    case "sm":
      classname = "sm:col-span-3"
      break
    case "md":
      classname = "sm:col-span-4"
      break
    case "lg":
      classname = "sm:col-span-5"
      break
    case "xl":
      classname = "sm:col-span-6"
      break
    case "2xl":
      classname = "sm:col-span-8"
      break
    case "full":
      classname = "sm:col-span-full"
      break
  }

  if (props.start) {
    classname += " sm:col-start-1"
  }

  return classname
})
</script>

<template>
  <div class="xy-form-cell" :class="classname">
    <slot />
  </div>
</template>
