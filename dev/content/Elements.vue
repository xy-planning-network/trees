<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <ComponentLayout :css-component="true" title="Badges">
        <template v-slot:description>
          Badges are used to display tags or categoies categories of
          information.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="checkboxCopy" />
          </label>
          <div class="mt-1">
            <span class="xy-badge">Primary</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="checkboxCopy" />
          </label>
          <div class="mt-1">
            <span class="xy-badge-blue">Info</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="checkboxCopy" />
          </label>
          <div class="mt-1">
            <span class="xy-badge-yellow">Alert</span>
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" :css-component="true" title="Buttons">
        <template v-slot:description>
          Buttons are the best. Clickable. What's not to love.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="checkboxCopy" />
          </label>
          <div class="mt-1">
            <button type="button" class="xy-btn">Primary</button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="checkboxCopy" />
          </label>
          <div class="mt-1">
            <button type="button" class="xy-btn-secondary">Secondary</button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="checkboxCopy" />
          </label>
          <div class="mt-1">
            <button type="button" class="xy-btn-green">Green</button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="checkboxCopy" />
          </label>
          <div class="mt-1">
            <button type="button" class="xy-btn-red">Red</button>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="checkboxCopy" />
          </label>
          <div class="mt-1">
            <button type="button" class="xy-btn-white">White</button>
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" :css-component="true" title="Links">
        <template v-slot:description>
          These things can really take you places. You'd be a fool to ignore.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="inputCopy" />
          </label>
          <div class="mt-1">
            <a href="#" class="xy-link">Take Me Somewhere</a>
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" :css-component="true" title="Typography">
        <template v-slot:description>
          Text. Who needs it? We need it!
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy value="<h1>Header1</h1>" />
          </label>
          <div class="mt-1">
            <h1 class="mb-4">Header1</h1>
            <h1>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              porta feugiat accumsan.
            </h1>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy value="<h1 class='xy-h1-responsive'>Header1</h1>" />
          </label>
          <div class="mt-1">
            <h1 class="xy-h1-responsive mb-4">Responsive Header1</h1>
            <h1 class="xy-h1-responsive">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              porta feugiat accumsan.
            </h1>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy value="<h2>Header2</h2>" />
          </label>
          <div class="mt-1">
            <h2 class="mb-4">Header2</h2>
            <h2>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              porta feugiat accumsan.
            </h2>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy value="<2 class='xy-2-responsive'>Header1</2>" />
          </label>
          <div class="mt-1">
            <h2 class="xy-h2-responsive mb-4">Responsive Header2</h2>
            <h2 class="xy-h2-responsive">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              porta feugiat accumsan.
            </h2>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy value="<h3>Header3</h3>" />
          </label>
          <div class="mt-1">
            <h3 class="mb-4">Header3</h3>
            <h3>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              porta feugiat accumsan.
            </h3>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy value="<h3 class='xy-h3-responsive'>Header1</h3>" />
          </label>
          <div class="mt-1">
            <h3 class="xy-h3-responsive mb-4">Responsive Header3</h3>
            <h3 class="xy-h3-responsive">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              porta feugiat accumsan.
            </h3>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy value="<h4>Header4</h4>" />
          </label>
          <div class="mt-1">
            <h4 class="mb-4">Header4</h4>
            <h4>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              porta feugiat accumsan.
            </h4>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy value="<h5>Header5</h5>" />
          </label>
          <div class="mt-1">
            <h5 class="mb-4">Header5</h5>
            <h5>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              porta feugiat accumsan.
            </h5>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="extraFlairCopy" />
          </label>
          <div class="mt-1">
            <h1 class="xy-h1-extra-flair mb-4">Header1 Bold</h1>
            <h1 class="xy-h1-extra-flair">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras
              porta feugiat accumsan.
            </h1>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy value="<p>I'm a delicous paragraph</p>" />
          </label>
          <div class="mt-1">
            <p>
              I'm a delicous paragraph. Lorem ipsum dolor sit amet, consectetur
              adipiscing elit. In non viverra neque. Ut eleifend in massa
              faucibus hendrerit. Vivamus suscipit pulvinar pharetra. In
              convallis vel nunc ac semper. Proin mollis ac dui a vehicula.
              Aenean odio libero, varius id justo sed, aliquam scelerisque ante.
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia curae; Aliquam erat volutpat. Vestibulum ac purus
              ut dolor efficitur pharetra.
            </p>
          </div>
        </div>
      </ComponentLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-property-decorator"

@Options({ name: "Elements" })
export default class Elements extends Vue {
  extraFlairCopy = `<h1 class="xy-h1-extra-flair">Header1 Bold</h1>`
}
</script>
