<script setup lang="ts">
// TODO: think about whether there is value in updating and emiting step with next/previous
// TODO: add to docs

withDefaults(
  defineProps<{
    hideActions?: boolean
    hidePrevious?: boolean
    nextText?: string
    previousText?: string
    step: number
    total: number
  }>(),
  {
    hideActions: false,
    hidePrevious: false,
    nextText: "Next",
    previousText: "Back",
  }
)

const emit = defineEmits(["next", "previous"])

const next = (): void => {
  emit("next")
}

const previous = (): void => {
  emit("previous")
}
</script>
<template>
  <div>
    <nav class="flex items-center justify-center space-x-8">
      <p class="font-medium">Step {{ step }} of {{ total }}</p>
      <ul class="flex items-center space-x-5">
        <li v-for="index in total" :key="index">
          <span
            v-if="step > index"
            class="block w-2.5 h-2.5 bg-xy-green rounded-full hover:bg-green-900 focus:bg-green-900"
          ></span>

          <div
            v-else-if="step === index"
            class="relative flex items-center justify-center"
          >
            <span class="absolute w-5 h-5 p-px flex">
              <span class="w-full h-full rounded-full bg-green-100"></span>
            </span>
            <span
              class="relative block w-2.5 h-2.5 bg-xy-green rounded-full"
            ></span>
          </div>

          <span
            v-else
            href="#"
            class="block w-2.5 h-2.5 bg-gray-200 rounded-full hover:bg-gray-400 focus:bg-gray-400"
          ></span>
        </li>
      </ul>
    </nav>

    <div v-if="!hideActions" class="flex shrink-0">
      <span v-if="!hidePrevious" class="inline-flex rounded-md shadow-sm">
        <button
          type="button"
          class="xy-btn-white"
          @click="previous"
          v-text="previousText"
        ></button>
      </span>
      <span class="ml-3 inline-flex rounded-md shadow-sm">
        <button
          type="button"
          class="xy-btn"
          @click="next"
          v-text="nextText"
        ></button>
      </span>
    </div>
  </div>
</template>
