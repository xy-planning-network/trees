<script setup lang="ts">
import { ref } from "vue"
import User from "@/composables/user"

defineProps<{
  user: User
}>()

const progressCircleProps = [
  { name: "step", required: true, type: "number" },
  {
    name: "steps",
    required: true,
    type: "Array<{name: string, description?: string}>",
  },
]

const progressCirclesCopy = `<ProgressCircles :current="currentStep" :steps="steps" />`
const progressCirclesLabeledCopy = `<ProgressCirclesLabeled :current="currentStep" :steps="steps" />`

const currentStep = ref(2)
const steps = [
  { name: "Sign Up", description: "Complete the registration process." },
  {
    name: "Verify Email",
    description: "Check your inbox for a verification link.",
  },
  {
    name: "Set Up Profile",
    description: "Tell us more about yourself to personalize your experience.",
  },
  {
    name: "Choose a Plan",
    description: "Select the best plan that fits your needs.",
  },
  {
    name: "Review and Submit",
    description: "Ensure all information is correct before submission.",
  },
]
</script>
<template>
  <div class="docs-page-wrapper">
    <ComponentLayout title="Progress Circles">
      <template #description
        >Progress Circles help indicate the current step of a multi-step UI.
        This small version is useful for mobile views or inside tight spaces.
        The horizontal layout is default aligned i.e. (left) and does not assume
        how it will be used in layouts to maintain flexibile layout options
        around other componentes. The "current" step is indicated with the index
        of a step in the steps props. You can use -1 to indicate no steps are
        current or complete and any number >= steps.length will cause all steps
        to appear complete. Currently, ProgressCircles assumes a linear progress
        of steps is required and it does not act as a navigation. It simply
        displays progress. While this component does not display copy, it does
        require copy in steps prop for accessibility</template
      >

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="progressCirclesCopy" />
        </label>
        <div class="mt-4">
          <div class="space-y-6">
            <div>
              <h5 class="mb-2">Not Started</h5>
              <ProgressCircles :current="-1" :steps="steps" />
            </div>
            <div>
              <h5 class="mb-2">Index 2 (Step 3 is current)</h5>
              <ProgressCircles :current="currentStep" :steps="steps" />
            </div>
            <div>
              <h5 class="mb-2">Completed</h5>
              <ProgressCircles :current="5" :steps="steps" />
            </div>
          </div>
          <PropsTable :props="progressCircleProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Progress Circles Labeled">
      <template #description
        >Progress Circles with Lables help indicate the current step of a
        multi-step UI and support displaying a label and description for each
        step. This larger version is useful for larger viewports. The "current"
        step is indicated with the index of a step in the steps props. You can
        use -1 to indicate no steps are current or complete and any number >=
        steps.length will cause all steps to appear complete. Currently,
        ProgressCirclesLabeled assumes a linear progress of steps is required
        and it does not act as a navigation. It simply displays
        progress.</template
      >

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="progressCirclesLabeledCopy" />
        </label>

        <div class="mt-4">
          <div class="grid sm:grid-cols-2 gap-6">
            <div class="space-y-3">
              <h5>Not Started - With Descriptions</h5>
              <ProgressCirclesLabeled :current="-1" :steps="steps" />
            </div>

            <div class="space-y-3">
              <h5>Index 2 - No Descriptions</h5>
              <ProgressCirclesLabeled
                :current="2"
                :steps="
                  steps.map((s) => {
                    return { name: s.name }
                  })
                "
              />
            </div>
          </div>
        </div>
        <PropsTable :props="progressCircleProps" />
      </div>
    </ComponentLayout>
  </div>
</template>
