<script setup lang="ts">
withDefaults(
  defineProps<{
    as?: string
    btnText?: string
    btnDisabled?: boolean
    columns: 1 | 2
  }>(),
  { as: "form", btnDisabled: false, btnText: "" }
)
</script>

<template>
  <component :is="as" class="space-y-10">
    <slot />

    <div v-if="btnText" class="flex justify-end">
      <button class="xy-btn" type="submit" :disabled="btnDisabled">
        {{ btnText }}
      </button>
    </div>
  </component>
</template>
