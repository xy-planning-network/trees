<script setup lang="ts">
import { CheckIcon } from "@heroicons/vue/solid"
import { computed } from "vue"

type StepStatus = "complete" | "current" | "incomplete"

interface Step {
  name: string
  description?: string
}

const props = defineProps<{
  /**
   * current sets the "current" step using an index of the steps prop
   * to show all steps in an "incomplete" state set step to -1
   * to show all steps in an "complete" state set step to a value >= steps.length
   */
  current: number
  steps: Step[]
}>()

const layoutSteps = computed(() => {
  return props.steps.map((step, stepIndex) => {
    let status: StepStatus

    if (props.current > stepIndex) {
      status = "complete"
    } else if (props.current === stepIndex) {
      status = "current"
    } else {
      status = "incomplete"
    }

    return {
      name: step.name,
      description: step?.description || "",
      status: status,
    }
  })
})
</script>

<template>
  <nav aria-label="Progress">
    <ol role="list" class="flex items-center">
      <li
        v-for="(step, index) in layoutSteps"
        :key="step.name"
        :class="[index !== layoutSteps.length - 1 ? 'pr-8' : '', 'relative']"
      >
        <!--NOTE: horizontal connecting bar-->
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
          <div
            :class="[
              'h-0.5 w-full',
              step.status === 'complete' ? 'bg-xy-blue' : 'bg-gray-200',
            ]"
          />
        </div>
        <div
          :class="{
            'relative flex h-5 w-5 items-center justify-center rounded-full': true,
            'bg-xy-blue': step.status === 'complete',
            'border-2 border-indigo-600 bg-white': step.status === 'current',
            'border-2 border-gray-300 bg-white': step.status === 'incomplete',
          }"
          :aria-current="step.status === 'current' ? true : undefined"
        >
          <CheckIcon
            v-if="step.status === 'complete'"
            class="h-3 w-3 text-white"
            aria-hidden="true"
          />
          <span
            v-else-if="step.status === 'current'"
            class="h-3 w-3 rounded-full bg-xy-blue"
            aria-hidden="true"
          />
          <span class="sr-only">{{ step.name }}</span>
          <span v-if="step.description" class="sr-only">{{
            step.description
          }}</span>
        </div>
      </li>
    </ol>
  </nav>
</template>
