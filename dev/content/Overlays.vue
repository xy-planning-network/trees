<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <ComponentLayout title="Flash">
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
                <p class="text-sm leading-5 text-gray-500">
                  If you move forward, things are gonna get gone!
                </p>
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
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-property-decorator";

@Options({ name: "Overlays" })
export default class Overlays extends Vue {
  flashCopy = `window.VueBus.emit("Flash-show-generic-error", "support@trees.com")`;
  modalCopy = `<Modal v-model="open" :destructive="false" submit-text="Save" title="Create New Thing" @submit="created()"></Modal>`;
  modalProps = [
    { name: "destructive", required: false, type: "boolean" },
    { name: "disabled", required: false, type: "boolean" },
    { name: "modelValue", required: true, type: "boolean" },
    { name: "submitText", required: false, type: "string" },
    { name: "title", required: true, type: "string" },
  ];
  open = false;
  spinnerCopy = `window.VueBus.emit("Spinner-show"); window.setTimeout(() => { window.VueBus.emit("Spinner-hide"); }, 3000);`;

  flash(): void {
    window.VueBus.emit("Flash-show-generic-error", "support@trees.com");
  }
  spinner(): void {
    window.VueBus.emit("Spinner-show");
    window.setTimeout(() => {
      window.VueBus.emit("Spinner-hide");
    }, 3000);
  }
}
</script>