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
            <h1>Header1</h1>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy value="<h2>Header2</h2>" />
          </label>
          <div class="mt-1">
            <h2>Header2</h2>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy value="<h3>Header3</h3>" />
          </label>
          <div class="mt-1">
            <h3>Header3</h3>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy value="<h4>Header4</h4>" />
          </label>
          <div class="mt-1">
            <h4>Header4</h4>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy value="<h5>Header5</h5>" />
          </label>
          <div class="mt-1">
            <h5>Header5</h5>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="extraFlairCopy" />
          </label>
          <div class="mt-1">
            <h1 class="xy-h1-extra-flair">Header1 Bold</h1>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy value="<p>I'm a delicous paragraph</p>" />
          </label>
          <div class="mt-1">
            <p>I'm a delicous paragraph</p>
          </div>
        </div>
      </ComponentLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-property-decorator";

@Options({ name: "Elements" })
export default class Elements extends Vue {
  extraFlairCopy = `<h1 class="xy-h1-extra-flair">Header1 Bold</h1>`;
}
</script>