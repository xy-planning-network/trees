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
  <div aria-label="Progress">
    <ol role="list" class="overflow-hidden">
      <li
        v-for="(step, index) in layoutSteps"
        :key="index"
        :class="[index !== layoutSteps.length - 1 ? 'pb-10' : '', 'relative']"
      >
        <!--NOTE: vertical connecting bar-->
        <div
          v-if="index !== layoutSteps.length - 1"
          :class="[
            'absolute left-4 top-4 -ml-px mt-0.5 h-full w-0.5',
            step.status === 'complete' ? 'bg-xy-blue' : 'bg-gray-300',
          ]"
          aria-hidden="true"
        />
        <div
          class="group relative flex items-start"
          :aria-current="step.status === 'current' ? true : undefined"
        >
          <span class="flex h-9 items-center">
            <span
              :class="{
                'relative z-10 flex h-8 w-8 items-center justify-center rounded-full': true,
                'bg-xy-blue ': step.status === 'complete',
                'border-2 border-xy-blue bg-white': step.status === 'current',
                'border-2 border-gray-300 bg-white':
                  step.status === 'incomplete',
              }"
            >
              <CheckIcon
                v-if="step.status === 'complete'"
                class="h-5 w-5 text-white"
                aria-hidden="true"
              />
              <span
                v-else-if="step.status === 'current'"
                class="h-2.5 w-2.5 rounded-full bg-xy-blue"
              />
            </span>
          </span>
          <span class="ml-4 flex min-w-0 flex-col">
            <span
              :class="{
                'text-sm font-bold': true,
                'text-gray-800': step.status === 'complete',
                'text-xy-blue': step.status === 'current',
                'text-gray-500': step.status === 'incomplete',
                'mt-2': !step.description,
              }"
              >{{ step.name }}</span
            >
            <span v-if="step.description" class="text-sm text-gray-500">{{
              step.description
            }}</span>
          </span>
        </div>
      </li>
    </ol>
  </div>
</template>
