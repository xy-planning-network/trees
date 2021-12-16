<script setup lang="ts">
import { ref } from "vue"
import { CheckIcon } from "@heroicons/vue/outline"

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
  window.VueBus.emit("Spinner-show")
  window.setTimeout(() => {
    window.VueBus.emit("Spinner-hide")
  }, 3000)
}
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
    </div>
  </div>
</template>
