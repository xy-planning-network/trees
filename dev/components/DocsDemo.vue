<script lang="ts" setup></script>

<template>
  <div class="mt-4">
    <div
      class="not-prose bg-neutral-50/50 border border-neutral-100 shadow-sm overflow-hidden relative rounded-xl"
    >
      <div
        style="background-position: 10px 10px"
        class="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"
      />
      <div class="relative rounded-xl overflow-auto p-8">
        <slot />
      </div>
    </div>
  </div>
</template>

<style>
.bg-grid-slate-100 {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23f1f5f9'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
</style>
