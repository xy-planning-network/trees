<script setup lang="ts">
import { ref } from "vue"
import { CheckIcon } from "@heroicons/vue/outline"
import { ExclamationIcon } from "@heroicons/vue/outline"
import { PopoverPosition } from "@/lib-components/overlays/Popover/Popover.vue"
import { useAppFlasher } from "@/composables/useFlashes"
import { useAppSpinner } from "@/composables"
import ProseBase from "../helpers/ProseBase.vue"
import CodeSample from "../helpers/CodeSample.vue"

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

const popoverPositions: PopoverPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
  "left",
  "right",
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
    type: "PopoverPosition - default: auto",
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
    type: "PopoverPosition - default: auto",
  },
]

const advancedPopoverCopy = `<Popover><PopoverContent>This is an advanced Popover.</PopoverContent></Popover>`
const tooltipCopy = `<Tooltip>Here's something subtly helpful.</Tooltip>`
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <ComponentLayout title="Content Modal">
        <template #description>
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
              <template #icon>
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
        <template #description>
          We look for an array of flashes on <code>window.Flashes</code> and we
          can deploy flashes from anywhere with the useAppFlashes composable.
        </template>

        <ProseBase>
          <div class="mt-1 space-y-2">
            <div>
              <h4>Flash generic error using configured email address:</h4>
              <CodeSample>{{
                `
/* Import and do this anytime, best before createApp() or inside a root app level component */
import {useAppFlashes} from "@xy-planning-network/trees"
useAppFlashes().configure({email: "support@trees.com"})

/* use as needed.  imports of useAppFlasher throughout the app will produce the same result */
useAppFlashes().flasher.genericError()
              `
              }}</CodeSample>
              <button
                type="button"
                class="xy-btn"
                @click="useAppFlasher.genericError()"
              >
                Show Me
              </button>
            </div>
            <div>
              <h4>
                useAppFlasher is the default export as is what you need most of
                the time.
              </h4>
              <CodeSample>{{
                `
import useAppFlasher from "@xy-planning-network/trees"
              `
              }}</CodeSample>

              <h4>Flash generic error with custom email address:</h4>
              <CodeSample>{{
                `
useAppFlasher.genericError("help@trees.com")
              `
              }}</CodeSample>
              <button
                type="button"
                class="xy-btn"
                @click="useAppFlasher.genericError('help@trees.com')"
              >
                Show Me
              </button>
            </div>
            <div>
              <h4>Flash (error, info, success, warning):</h4>
              <CodeSample>{{
                `
useAppFlasher.error("Hooray!")
useAppFlasher.info("Hooray!")
useAppFlasher.success("Hooray!")
useAppFlasher.warning("Hooray!")
              `
              }}</CodeSample>
              <button
                type="button"
                class="xy-btn"
                @click="useAppFlasher.success('Hooray!')"
              >
                Flash Success
              </button>
            </div>
            <div>
              <h4>Flash persistent info:</h4>
              <CodeSample>{{
                `
useAppFlasher.info("Sticky!", true)
              `
              }}</CodeSample>
              <button
                type="button"
                class="xy-btn"
                @click="useAppFlasher.info('Sticky!', true)"
              >
                Flash Persistent
              </button>
            </div>
          </div>
        </ProseBase>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Modal">
        <template #description>
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
        <template #description>
          This is automatically handled in axios if the request takes longer
          than 200 milliseconds. It blocks any user interaction while it's
          shown.
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
        <template #description>
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
        <template #description>
          This component wraps the headless ui Popover, PopoverButton, and
          PopoverPanel components. It provides a #button and default slot for
          customizing the trigger and content while offering a positioning prop.
          The popover content is heavily customizable in the default slot. Use
          the PopoverContent component for basic initial wrapper styling.
          Positioning is absolute and subject to parent container overflow
          rules. You're responsible for managing the width of your popover
          content. Generally, popovers should be narrow and start with a
          max-w-sm class.
        </template>

        <div>
          <div class="flex justify-center mb-8">
            <label class="block text-sm font-medium text-gray-700">
              <ClickToCopy :value="advancedPopoverCopy" />
            </label>
          </div>

          <div class="mt-2 flex justify-center">
            <Popover>
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

          <div class="mt-8 flex justify-center">
            <Popover>
              <template #button>
                <span class="xy-btn">Hi, hello, nice to meet you...</span>
              </template>
              <PopoverContent class="bg-xy-blue border-0 w-screen lg:max-w-md">
                <div class="text-white text-base font-medium p-8">
                  Hi, hello, nice to meet you in the flesh I've only seen you
                  from the neck up, it's weird to see your legs Low key, I know
                  I'm shorter than what all of y'all expected It's awkward when
                  you look me up and down but don't address it Handshakes, all
                  sweat, what to do next… How are people supposed to act in the
                  office? I forget Pull my phone out my pocket act like I just
                  got a text But I didn't, I just move my thumb around for a sec
                  Out of habit I check Slack, like it's any other day Then
                  remember everyone is here, like 6 feet away I gotta talk, like
                  with my mouth, if I wanna communicate But if I can't send
                  memes and gifs, I ain't got nothing to say I miss my cat, I
                  miss my dog, I'm ready to leave I miss my bed sheets, and
                  farting when I please I should've told my boss I had somewhere
                  to be Damn, this is gonna be a long a** week
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <PropsTable :props="popoverProps"></PropsTable>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Tooltip">
        <template #description>
          A simple tooltip component. Triggered by a single universally
          understood icon. Your tooltip content is supplied in the default slot.
        </template>

        <div>
          <div class="flex justify-center mb-8">
            <label class="block text-sm font-medium text-gray-700">
              <ClickToCopy :value="tooltipCopy" />
            </label>
          </div>

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
            <strong>Auto positioning</strong> favors left to right positioning.
            i.e. if there appears to be space available to the right of the
            trigger the tooltip content will flow toward the right. Top and
            bottom positioning is prioritized by the current viewport, giving
            preference where more visible space currently exists.
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

      <ComponentLayout
        class="mt-8"
        :show-badge="false"
        title="Stacking Context"
      >
        <template #description>
          Overlay components naturally can introduce complications in stacking
          context and z-index for any application. We've made best attempts to
          set sane z-index values on each overlay component in an order that
          makes sense for the component's general usage. These components are
          all wrapped in the <code>&lt;Portal /&gt;</code> component made
          available by HeadlessUI/Vue to ensure they share a stacking context.
          We've additionally, preserved the highest order z-index (z-50) for
          consumers when necessary.
        </template>

        <ProseBase>
          <h4>Tailwind CSS z-index Values</h4>
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>z-index</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Popover/Tooltip</td>
                <td>z-10</td>
              </tr>
              <tr>
                <td>App Sidebar Mobile Nav</td>
                <td>z-10</td>
              </tr>
              <tr>
                <td>Slideover</td>
                <td>z-20</td>
              </tr>
              <tr>
                <td>Modal</td>
                <td>z-30</td>
              </tr>
              <tr>
                <td>Spinner</td>
                <td>z-40</td>
              </tr>
              <tr>
                <td>Flash</td>
                <td>z-45</td>
              </tr>
              <tr>
                <td>Unused (preserved for consumers)</td>
                <td>z-50</td>
              </tr>
            </tbody>
          </table>

          <h4>Climbing Above The Rest</h4>
          <p>
            In the event that you need to establish a z-index level above any of
            the overlay components, you'll need to wrap your component in the
            HeadlessUI/Vue <code>&lt;Portal /&gt;</code> component. This
            convenience component is not documented by HeadlessUI, but is
            effectively a wrapper around the Vue Teleport component. It
            maintains a single container before the closing body tag and
            teleports all Portal markup to that location ensuring the same
            stacking context between those DOM elements.
          </p>
          <CodeSample language="html"
            >{{ `
            <script lang="ts" setup>
              import { Portal } from "@headlessui/vue"
            </script>

            <template>
              <Portal>
                <div class="fixed top-0 left-0 right-0 bottom-0 z-50">
                  <h1>Head and shoulders above the rest!</h1>
                </div>
              </Portal>
            </template>
            ` }}</CodeSample
          >
        </ProseBase>
      </ComponentLayout>
    </div>
  </div>
</template>
