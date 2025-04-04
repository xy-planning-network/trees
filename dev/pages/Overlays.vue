<script setup lang="ts">
import { ref } from "vue"
import { useAppFlasher } from "@/composables/useFlashes"
import { CheckIcon } from "@heroicons/vue/outline"
import { ExclamationIcon } from "@heroicons/vue/outline"
import { useAppSpinner } from "@/composables"
import type { Placement } from "@floating-ui/vue"

const contentModalCopy = `<ContentModal v-model="open" :content="content" :title="title"></ContentModal>`

const contentModalOpen = ref(false)
const contentModalProps = [
  { name: "modelValue", required: true, type: "boolean" },
  { name: "btnText", required: false, type: "string" },
  { name: "title", required: false, type: "string" },
]
const modalCopy = `<Modal v-model="open" :destructive="false" submit-text="Save" title="Create New Thing" @submit="created()"></Modal>`
const modalProps = [
  { name: "destructive", required: false, type: "boolean" },
  { name: "disabled", required: false, type: "boolean" },
  { name: "modelValue", required: true, type: "boolean" },
  { name: "submitText", required: false, type: "string" },
  { name: "title", required: true, type: "string" },
  { name: "wide", required: false, type: "boolean" },
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

const popoverPositions: Placement[] = [
  "top",
  "right",
  "bottom",
  "left",
  "top-start",
  "top-end",
  "right-start",
  "right-end",
  "bottom-start",
  "bottom-end",
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
  <div class="docs-page-wrapper">
    <ComponentLayout title="Content Modal">
      <template #description>
        This bad boy is used to show the user some content. The default slot is
        for the primary content.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="contentModalCopy" />
        </label>
        <div class="mt-1">
          <button type="button" class="xy-btn" @click="contentModalOpen = true">
            Show Me
          </button>
          <ContentModal
            v-model="contentModalOpen"
            title="Good Job!"
            @close="$log('ContentModal close event triggered!')"
            @update:model-value="
              $log(`v-model update event for ContentModal: ${$event}`)
            "
          >
            <template #icon>
              <div
                class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
              >
                <CheckIcon class="h-6 w-6 text-green-600" aria-hidden="true" />
              </div>
            </template>
            <p>You did really good. Look at this badge.</p>
          </ContentModal>
          <PropsTable :props="contentModalProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Flash">
      <template #description>
        We look for an array of flashes on <code>window.Flashes</code> and we
        can deploy flashes from anywhere with the useAppFlashes composable.
      </template>

      <FlashDocs />

      <div class="flex flex-col space-y-3">
        <button
          type="button"
          class="xy-btn"
          @click="useAppFlasher.genericError()"
        >
          Generic Error with default email
        </button>
        <button
          type="button"
          class="xy-btn"
          @click="useAppFlasher.genericError('help@trees.com')"
        >
          Show Generic with custom email
        </button>
        <button
          type="button"
          class="xy-btn"
          @click="useAppFlasher.success('Hooray!')"
        >
          Flash Success
        </button>
        <button
          type="button"
          class="xy-btn"
          @click="useAppFlasher.info('Sticky!', true)"
        >
          Flash Persistent
        </button>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Modal">
      <template #description>
        This component wraps hiding and showing the model. The parent passes a
        boolean that controls hidding and showing it. The default slot is for
        the primary content, while an optional named slot (buttons) can be used
        for an alternative button layout.
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
            @close="$log('Modal close event triggered!')"
            @submit="open = false"
            @update:model-value="
              $log(`v-model update event for Modal: ${$event}`)
            "
          >
            <div class="mt-6">
              <p>If you move forward, things are gonna get gone!</p>
            </div>
          </Modal>
          <PropsTable :props="modalProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Spinner">
      <template #description>
        This is automatically handled in axios if the request takes longer than
        200 milliseconds. It blocks any user interaction while it's shown.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="spinnerCopy" />
        </label>
        <div class="space-y-5">
          <div>
            <XYSpinner />
          </div>
          <div class="mt-1">
            <button type="button" class="xy-btn" @click="spinner()">
              Show Me
            </button>
          </div>
        </div>
      </div>
    </ComponentLayout>
    <ComponentLayout title="Slideover">
      <template #description>
        A sidebar like content container that "slides over" your main content on
        a trigger. It has a default slot for the primary content of the sidebar.
        Use the @close event to fire of any actions you might need to hook into
        when the slideover closes.
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
            @close="$log('Slideover close event triggered!')"
            @update:model-value="
              $log(`v-model update event for Slideover: ${$event}`)
            "
          >
            <div class="prose">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
                id nibh consequat, semper odio et, porta ex. Sed dapibus eu
                massa vel ultrices. Mauris mattis nisi sem, vel dictum odio
                pretium ullamcorper. Fusce suscipit nulla in felis cursus
                consectetur.
              </p>
              <p>
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
                posuere cubilia curae; Morbi massa dui, commodo non sem vel,
                laoreet dictum est. Integer fermentum pretium erat vitae
                ultrices. Aenean eu maximus mi, in congue ipsum. Vivamus
                dignissim iaculis dolor, a sollicitudin metus tincidunt ac.
              </p>
            </div>
          </Slideover>
          <PropsTable :props="slideoverProps"></PropsTable>
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Popover">
      <template #description>
        This component wraps the headless ui Popover, PopoverButton, and
        PopoverPanel components. It provides a #button and default slot for
        customizing the trigger and content while offering a positioning prop.
        The popover content is heavily customizable in the default slot. Use the
        PopoverContent component for basic initial wrapper styling. Positioning
        is absolute and subject to parent container overflow rules. You're
        responsible for managing the width of your popover content. Generally,
        popovers should be narrow and start with a max-w-sm class.
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
          <Popover position="bottom">
            <template #button>
              <span class="xy-btn">Hi, hello, nice to meet you...</span>
            </template>
            <PopoverContent class="bg-xy-blue border-0 w-screen lg:max-w-md">
              <div class="text-white text-base font-medium p-8">
                Hi, hello, nice to meet you in the flesh I've only seen you from
                the neck up, it's weird to see your legs Low key, I know I'm
                shorter than what all of y'all expected It's awkward when you
                look me up and down but don't address it Handshakes, all sweat,
                what to do next… How are people supposed to act in the office? I
                forget Pull my phone out my pocket act like I just got a text
                But I didn't, I just move my thumb around for a sec Out of habit
                I check Slack, like it's any other day Then remember everyone is
                here, like 6 feet away I gotta talk, like with my mouth, if I
                wanna communicate But if I can't send memes and gifs, I ain't
                got nothing to say I miss my cat, I miss my dog, I'm ready to
                leave I miss my bed sheets, and farting when I please I
                should've told my boss I had somewhere to be Damn, this is gonna
                be a long a** week
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <PropsTable :props="popoverProps"></PropsTable>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Tooltip">
      <template #description>
        A simple tooltip component. Triggered by a single universally understood
        icon. Your tooltip content is supplied in the default slot.
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
            <Tooltip :position="position"> This is a simple tooltip. </Tooltip>
          </div>
        </div>
      </div>

      <div class="mt-8">
        <p class="mb-4">
          <strong>Auto positioning</strong> is managed by floating-ui's
          <a
            class="text-xy-blue underline"
            href="https://floating-ui.com/docs/autoplacement"
            >autoPlacement</a
          >
          middleware It will be used anytime the position prop is "auto".
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

    <ComponentLayout :show-badge="false" title="Stacking Context">
      <template #description>
        Overlay components naturally can introduce complications in stacking
        context and z-index for any application. We've made best attempts to set
        sane z-index values on each overlay component in an order that makes
        sense for the component's general usage. These components are all
        wrapped in the <code>&lt;Portal /&gt;</code> component made available by
        HeadlessUI/Vue to ensure they share a stacking context. We've
        additionally, preserved the highest order z-index (z-50) for consumers
        when necessary.
      </template>

      <StackingContextDocs />
    </ComponentLayout>
  </div>
</template>
