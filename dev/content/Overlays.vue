<script setup lang="ts">
import { ref } from "vue"
import { CheckIcon } from "@heroicons/vue/outline"
import { ExclamationIcon } from "@heroicons/vue/outline"
import { PopoverPosition } from "@/lib-components/overlays/Popover/Popover.vue"

const contentModalCopy = `<ContentModal v-model="open" :content="content" :title="title"></ContentModal>`

const contentModalOpen = ref(false)
const contentModalProps = [
  { name: "modelValue", required: true, type: "boolean" },
  { name: "title", required: false, type: "string" },
]
const flashCopy = `window.VueBus.emit("Flash-show-generic-error", "support@trees.com")`
const modalCopy = `<Modal v-model="open" :destructive="false" submit-text="Save" title="Create New Thing" @submit="created()"></Modal>`
const modalProps = [
  { name: "destructive", required: false, type: "boolean" },
  { name: "disabled", required: false, type: "boolean" },
  { name: "modelValue", required: true, type: "boolean" },
  { name: "submitText", required: false, type: "string" },
  { name: "title", required: true, type: "string" },
]
const open = ref(false)
const spinnerCopy = `window.VueBus.emit("Spinner-show"); window.setTimeout(() => { window.VueBus.emit("Spinner-hide"); }, 3000);`
const slideoverOpen = ref(false)
const slideoverCopy = `<Slideover v-model="slideoverOpen" header="Slideover Header" description="A very helpful slideover description"></Slideover>`
const slideoverProps = [
  { name: "v-model", required: true, type: "boolean" },
  { name: "header", required: false, type: "string" },
  { name: "description", required: false, type: "description" },
  { name: "@close", required: false, type: "function(modelValue)" },
]

const flash = function (): void {
  window.VueBus.emit("Flash-show-generic-error", "support@trees.com")
}
const spinner = function (): void {
  window.VueBus.emit("Spinner-show", [
    "Look!",
    "I can also display messages.",
    "In case you need them.",
  ])
  window.setTimeout(() => {
    window.VueBus.emit("Spinner-hide")
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
  { name: "text", required: false, type: 'string - default: ""' },
  { name: "triggerText", required: false, type: 'string - default: ""' },
  {
    name: "triggerIcon",
    required: false,
    type: "RenderFunction - default: InformationCircleIcon",
  },
  {
    name: "position",
    required: false,
    type: "PopoverPosition - default: top-center",
  },
]

const simplePopoverCopy = `<Popover text="This is a simple Popover."></Popover>`
const advancedPopoverCopy = `<Popover><PopoverContent>This is an advanced Popover.</PopoverContent></Popover>`
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
          can emit events on the bus that render flashes.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="flashCopy" />
          </label>
          <div class="mt-1">
            <button type="button" class="xy-btn" @click="flash()">
              Show Me
            </button>
          </div>
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
          PopoverPanel components and provides bare bones styling and
          positioning options. The popover content is heavily customizable when
          you supply your own PopoverContent component in the default slot. It
          is designed to handle the most common case where a tooltip like UI is
          required. Positioning is absolute and subject to parent container
          overflow rules.
        </template>

        <div>
          <label
            class="block text-sm font-medium text-gray-700 text-center flex flex-inline justify-center"
          >
            <h3 class="mr-2">Basic Popovers - By Position</h3>
            <ClickToCopy :value="simplePopoverCopy" />
          </label>

          <div
            v-for="(position, index) in popoverPositions"
            :key="index"
            class="mt-8"
          >
            <div class="flex justify-center">{{ position }}</div>
            <div class="flex justify-center">
              <Popover :position="position" text="This is a simple Popover." />
            </div>
          </div>

          <label
            class="block text-sm font-medium text-gray-700 text-center flex flex-inline justify-center mt-8"
          >
            <h3 class="mr-2">
              Advanced Popovers - Custom content and triggers
            </h3>
            <ClickToCopy :value="advancedPopoverCopy" />
          </label>

          <div class="mt-2 flex justify-center">
            <Popover :button-icon="ExclamationIcon">
              <PopoverContent>
                <div class="flex items-center">
                  <ExclamationIcon class="w-5 h-5 mr-2" />
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
              </PopoverContent>
            </Popover>
          </div>

          <div class="mt-2 flex justify-center">
            <Popover>
              <PopoverContent
                class="bg-xy-blue text-white border-0 w-screen lg:max-w-md"
              >
                <div class="text-base p-4">
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

          <div class="mt-2 flex justify-center">
            <Popover text="A custom button trigger!">
              <template #button>
                <div class="xy-badge">
                  Badge <ExclamationIcon class="w-4 h-4 ml-1" />
                </div>
              </template>
            </Popover>
          </div>

          <PropsTable :props="popoverProps"></PropsTable>
        </div>
      </ComponentLayout>
    </div>
  </div>
</template>
