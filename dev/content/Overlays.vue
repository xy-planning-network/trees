<script setup lang="ts">
import { ref } from "vue"
import { CheckIcon } from "@heroicons/vue/outline"
import { ExclamationIcon } from "@heroicons/vue/outline"
import { useAppFlasher } from "@/composables/useFlashes"
import { useAppSpinner } from "@/composables"
import { PopperPosition } from "@/composables/usePopper"

const contentModalCopy = `<ContentModal v-model="open" :content="content" :title="title"></ContentModal>`

const contentModalOpen = ref(false)
const contentModalProps = [
  { name: "modelValue", required: true, type: "boolean" },
  { name: "title", required: false, type: "string" },
]
const modalCopy = `<Modal v-model="open" :destructive="false" submit-text="Save" title="Create New Thing" @submit="created()"></Modal>`
const modalProps = [
  { name: "destructive", required: false, type: "boolean" },
  { name: "disabled", required: false, type: "boolean" },
  { name: "modelValue", required: true, type: "boolean" },
  { name: "submitText", required: false, type: "string" },
  { name: "title", required: true, type: "string" },
]
const open = ref(false)
const spinnerCopy = `useAppSpinner.show(); window.setTimeout(() => { useAppSpinner.hide(); }, 3000);`
const slideoverOpen = ref(false)
const slideoverCopy = `<Slideover v-model="slideoverOpen" header="Slideover Header" description="A very helpful slideover description"></Slideover>`
const slideoverProps = [
  { name: "v-model", required: true, type: "boolean" },
  { name: "header", required: false, type: "string" },
  { name: "description", required: false, type: "description" },
  { name: "@close", required: false, type: "function(modelValue)" },
]
const spinner = function (): void {
  useAppSpinner.show([
    "Look!",
    "I can also display messages.",
    "In case you need them.",
  ])
  window.setTimeout(() => {
    useAppSpinner.hide()
  }, 15000)
}

const popoverPositions: PopperPosition[] = [
  "auto",
  "top",
  "bottom",
  "right",
  "left",
  "top-start",
  "top-end",
  "bottom-start",
  "bottom-end",
  "right-start",
  "right-end",
  "left-start",
  "left-end",
]

const popoverProps = [
  {
    name: "as",
    required: false,
    type: "string - default: div",
  },
  {
    name: "position",
    required: false,
    type: `${popoverPositions.join(" | ")} - default: auto`,
  },
]

const tooltipProps = [
  {
    name: "as",
    required: false,
    type: "string - default: span",
  },
  {
    name: "position",
    required: false,
    type: `${popoverPositions.join(" | ")} - default: auto`,
  },
]

const advancedPopoverCopy = `<Popover><PopoverContent>This is an advanced Popover.</PopoverContent></Popover>`
const tooltipCopy = `<Tooltip>Here's something subtly helpful.</Tooltip>`
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <ComponentLayout title="Content Modal">
        <template v-slot:description>
          This bad boy is used to show the user some content. The default slot
          is for the primary content.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="contentModalCopy" />
          </label>
          <div class="mt-1">
            <button
              type="button"
              class="xy-btn"
              @click="contentModalOpen = true"
            >
              Show Me
            </button>
            <ContentModal v-model="contentModalOpen" title="Good Job!">
              <template v-slot:icon>
                <div
                  class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
                >
                  <CheckIcon
                    class="h-6 w-6 text-green-600"
                    aria-hidden="true"
                  />
                </div>
              </template>
              <p>You did really good. Look at this badge.</p>
            </ContentModal>
            <PropsTable :props="contentModalProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Flash">
        <template v-slot:description>
          We look for an array of flashes on <code>window.Flashes</code> and we
          can deploy flashes from anywhere with the useAppFlashes composable.
        </template>

        <div>
          <ul class="mt-1 space-y-2">
            <li>
              <InputLabel
                label="Flash generic error using configured email address:"
              />
              <pre><code class="language-typescript">/* Import and do this anytime, best before createApp() or inside a root app level component */
import {useAppFlashes} from "@xy-planning-network/trees"
useAppFlashes().configure({email: "support@trees.com"})

/* use as needed.  imports of useAppFlasher throughout the app will produce the same result */
useAppFlashes().flasher.genericError()
</code></pre>
              <button
                type="button"
                class="xy-btn"
                @click="useAppFlasher.genericError()"
              >
                Show Me
              </button>
            </li>
            <li>
              <InputLabel
                label="useAppFlasher is the default export as is what you need most of the time."
              />
              <pre><code class="language-typescript">import useAppFlasher from "@xy-planning-network/trees"</code></pre>

              <InputLabel
                label="Flash generic error with custom email address:"
              />
              <pre><code class="language-typescript">useAppFlasher.genericError("help@trees.com")</code></pre>
              <button
                type="button"
                class="xy-btn"
                @click="useAppFlasher.genericError('help@trees.com')"
              >
                Show Me
              </button>
            </li>
            <li>
              <InputLabel label="Flash (error, info, success, warning):" />
              <pre><code class="language-typescript">useAppFlasher.error("Hooray!")
useAppFlasher.info("Hooray!")
useAppFlasher.success("Hooray!")
useAppFlasher.warning("Hooray!")</code></pre>
              <button
                type="button"
                class="xy-btn"
                @click="useAppFlasher.success('Hooray!')"
              >
                Flash Success
              </button>
            </li>
            <li>
              <InputLabel label="Flash persistent info:" />
              <pre><code class="language-typescript">useAppFlasher.info("Sticky!", true)</code></pre>
              <button
                type="button"
                class="xy-btn"
                @click="useAppFlasher.info('Sticky!', true)"
              >
                Flash Persistent
              </button>
            </li>
          </ul>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Modal">
        <template v-slot:description>
          This component wraps hiding and showing the model. The parent passes a
          boolean that controls hidding and showing it. The default slot is for
          the primary content, while an optional named slot (buttons) can be
          used for an alternative button layout.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="modalCopy" />
          </label>
          <div class="mt-1">
            <button type="button" class="xy-btn" @click="open = true">
              Show Me
            </button>
            <Modal
              v-model="open"
              :destructive="true"
              submit-text="Remove"
              title="Remove Thing"
              @submit="open = false"
            >
              <div class="mt-6">
                <p>If you move forward, things are gonna get gone!</p>
              </div>
            </Modal>
            <PropsTable :props="modalProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Spinner">
        <template v-slot:description>
          This is automatically handled in axios if the request takes longer
          than 200 milliseconds. It can also be shown/hidden using the VueBus.
          It blocks any user interaction while it's shown.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="spinnerCopy" />
          </label>
          <div class="mt-1">
            <button type="button" class="xy-btn" @click="spinner()">
              Show Me
            </button>
          </div>
        </div>
      </ComponentLayout>
      <ComponentLayout class="mt-8" title="Slideover">
        <template v-slot:description>
          A sidebar like content container that "slides over" your main content
          on a trigger. It has a default slot for the primary content of the
          sidebar. Use the @close event to fire of any actions you might need to
          hook into when the slideover closes.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="slideoverCopy" />
          </label>
          <div class="mt-1">
            <button type="button" class="xy-btn" @click="slideoverOpen = true">
              Show Me
            </button>
            <Slideover
              v-model="slideoverOpen"
              header="Slideover Header"
              description="A very helpful slideover description"
            >
              <div class="prose">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Quisque id nibh consequat, semper odio et, porta ex. Sed
                  dapibus eu massa vel ultrices. Mauris mattis nisi sem, vel
                  dictum odio pretium ullamcorper. Fusce suscipit nulla in felis
                  cursus consectetur.
                </p>
                <p>
                  Vestibulum ante ipsum primis in faucibus orci luctus et
                  ultrices posuere cubilia curae; Morbi massa dui, commodo non
                  sem vel, laoreet dictum est. Integer fermentum pretium erat
                  vitae ultrices. Aenean eu maximus mi, in congue ipsum. Vivamus
                  dignissim iaculis dolor, a sollicitudin metus tincidunt ac.
                </p>
              </div>
            </Slideover>
            <PropsTable :props="slideoverProps"></PropsTable>
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Popover">
        <template v-slot:description>
          This component wraps the headless ui Popover, PopoverButton, and
          PopoverPanel components. It provides a #button and default slot for
          customizing the trigger and content while offering a positioning prop.
          The popover content is heavily customizable in the default slot. Use
          the PopoverContent component for basic initial wrapper styling.
          Positioning is fixed and determined by the Popper.js integration.
          You're responsible for managing the width of your popover content.
          Generally, popovers should be narrow and start with a max-w-sm class.
          While it supports a positioning property you are encouraged to stick
          with auto unless you have confidence your popover can display given
          viewport constraints. For example table actions use bottom-end which
          should generally be safe given the menu size and location of tables in
          body content.
        </template>

        <div>
          <label
            class="flex flex-inline justify-center mt-8 text-sm font-medium text-gray-700 text-center"
          >
            <ClickToCopy :value="advancedPopoverCopy" />
          </label>

          <div
            v-for="(position, index) in popoverPositions"
            :key="index"
            class="mt-8"
          >
            <div class="flex justify-center">{{ position }}</div>
            <div class="flex justify-center">
              <Popover :position="position">
                <template #button>
                  <div class="xy-badge">
                    Badge <ExclamationIcon class="w-4 h-4 ml-1" />
                  </div>
                </template>
                <div
                  class="w-full max-w-xs rounded-lg bg-white border border-gray-100 shadow-md text-sm leading-tight font-medium"
                >
                  <div
                    v-for="n in 3"
                    :key="n"
                    class="flex items-center p-4 border-b"
                  >
                    <ExclamationIcon class="w-7 h-7 mr-2 text-yellow-500" />
                    <div>
                      You see that post on
                      <a
                        class="xy-link"
                        href="https://news.ycombinator.com/
              "
                        >Hacker News</a
                      >
                      today?
                    </div>
                  </div>
                </div>
              </Popover>
            </div>
          </div>

          <PropsTable :props="popoverProps"></PropsTable>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Tooltip">
        <template v-slot:description>
          A simple tooltip component. Triggered by a single universally
          understood icon. Your tooltip content is supplied in the default slot.
          While it supports a positioning argument you are encouraged to stick
          with auto.
        </template>

        <div>
          <label
            class="flex flex-inline justify-center text-sm font-medium text-gray-700 text-center"
          >
            <ClickToCopy :value="tooltipCopy" />
          </label>

          <div
            v-for="(position, index) in popoverPositions"
            :key="index"
            class="mt-8"
          >
            <div class="flex justify-center">{{ position }}</div>
            <div class="flex justify-center">
              <Tooltip :position="position">
                This is a simple tooltip.
              </Tooltip>
            </div>
          </div>
        </div>

        <div class="mt-8">
          <p class="mb-4">
            <strong>More Auto Positioning Tests</strong>
          </p>
          <div class="grid gap-4 grid-cols-5">
            <div v-for="index in 5" :key="index">
              <Tooltip>
                This is a simple tooltip. This is a simple tooltip. This is a
                simple tooltip. This is a simple tooltip. This is a simple
                tooltip.</Tooltip
              >
            </div>
          </div>
        </div>

        <PropsTable :props="tooltipProps"></PropsTable>
      </ComponentLayout>
    </div>
  </div>
</template>
