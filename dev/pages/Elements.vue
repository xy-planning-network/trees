<script setup lang="ts">
import { ref } from "vue"
import ColorRow from "../components/ColorRow.vue"
import colors from "../../config/theme/colors"
import PropsTable from "../components/PropsTable.vue"
import { InputOption } from "@/composables/forms"

const badgePrimary = ref<HTMLElement>()
const badgeInfo = ref<HTMLElement>()
const badgeSuccess = ref<HTMLElement>()
const badgeAlert = ref<HTMLElement>()
const links = ref<HTMLElement>()
const extraFlairCopy = `<h1 class="xy-h1-extra-flair">Header1 Bold</h1>`

const typefaces = {
  "font-sans": "Open Sans",
  "font-display": "Work Sans",
}

// NOTE(spk): explicitly written out so that tailwind doesn't prune the values
const fontSizes = [
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  "text-5xl",
  "text-6xl",
]

const weights = [
  "font-light",
  "font-normal",
  "font-medium",
  "font-semibold",
  "font-bold",
  "font-extrabold",
]

const alertKinds = ["alert", "warn", "info", "success"] as const
const alertOptions: InputOption[] = alertKinds.map((t) => {
  return { label: `${t.charAt(0).toUpperCase()}${t.slice(1)}`, value: t }
})
const alertSelection = ref<(typeof alertKinds)[number]>("alert")
const alert = (msg: string) => window.alert(msg)
const alertProps = [
  { name: "btnLink", required: false, type: "string" },
  { name: "btnText", required: false, type: "string" },
  { name: "content", required: true, type: "string | string[]" },
  { name: "dismissable", required: false, type: "boolean" },
  { name: "kind", required: true, type: "alert | warn | info | success" },
  { name: "secondaryBtnLink", required: false, type: "string" },
  { name: "secondaryBtnText", required: false, type: "string" },
  { name: "title", required: false, type: "string" },
]
</script>

<template>
  <div class="docs-page-wrapper">
    <ComponentLayout :css-component="true" title="Colors">
      <div
        class="grid grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-x-2 gap-y-8 sm:grid-cols-1"
      >
        <ColorRow name="" :colors="colors['xy-blue']" code="xy-blue" />
        <ColorRow name="" :colors="colors['xy-green']" code="xy-green" />
        <ColorRow
          name=""
          :colors="colors['xy-neutral']"
          code="xy-neutral/gray"
        />
      </div>
    </ComponentLayout>

    <ComponentLayout :css-component="false" title="Alerts">
      <template #description
        >Sometimes you need to get their attention and sometimes they need some
        direction. Alerts, we got em.</template
      >

      <div class="space-y-8">
        <div v-for="kind in alertKinds" :key="kind">
          <p class="font-medium text-sm mb-1">
            {{ `${kind.charAt(0).toUpperCase()}${kind.slice(1)}` }}
          </p>
          <InlineAlert
            ref="alertComponent"
            content="Arcu cursus euismod quis viverra nibh cras pulvinar mattis nunc sed blandit."
            :kind="kind"
            title="Orci eu lobortis elementum"
          />
        </div>

        <Select
          v-model="alertSelection"
          label="Alert Type"
          :options="alertOptions"
        />

        <div>
          <p class="font-medium text-sm mb-1">Simple Content</p>
          <InlineAlert
            content="Arcu cursus euismod quis viverra nibh cras pulvinar mattis nunc sed blandit."
            :kind="alertSelection"
          />
        </div>

        <div>
          <p class="font-medium text-sm mb-1">List Content</p>
          <InlineAlert
            :content="[
              'Arcu cursus euismod quis viverra nibh.',
              'Cras pulvinar mattis nunc sed blandit.',
            ]"
            :kind="alertSelection"
            title="Orci eu lobortis elementum"
          />
        </div>

        <div>
          <p class="font-medium text-sm mb-1">With Actions</p>
          <InlineAlert
            btn-text="Learn More"
            btn-link="https://theuselessweb.com/"
            content="Arcu cursus euismod quis viverra nibh cras pulvinar mattis nunc sed blandit."
            :kind="alertSelection"
            secondary-btn-text="Announce it"
            title="Orci eu lobortis elementum"
            @click:secondary.prevent="alert('Clicked It!')"
          />
        </div>

        <div>
          <p class="font-medium text-sm mb-1">Dismissable</p>
          <InlineAlert
            btn-text="Learn More"
            btn-link="https://theuselessweb.com/"
            content="Arcu cursus euismod quis viverra nibh cras pulvinar mattis nunc sed blandit."
            :dismissable="true"
            secondary-btn-text="Announce it"
            title="Orci eu lobortis elementum"
            :kind="alertSelection"
            @click:secondary.prevent="alert('Clicked It!')"
          />
        </div>

        <PropsTable :props="alertProps" />
      </div>
    </ComponentLayout>

    <ComponentLayout :css-component="true" title="Badges">
      <template #description>
        Badges are used to display tags or categoies categories of information.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="badgePrimary?.outerHTML" />
        </label>
        <div class="mt-1">
          <span ref="badgePrimary" class="xy-badge">Primary</span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="badgeInfo?.outerHTML" />
        </label>
        <div class="mt-1">
          <span ref="badgeInfo" class="xy-badge-blue">Info</span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="badgeSuccess?.outerHTML" />
        </label>
        <div class="mt-1">
          <span ref="badgeSuccess" class="xy-badge-green">Most Popular</span>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="badgeAlert?.outerHTML" />
        </label>
        <div class="mt-1">
          <span ref="badgeAlert" class="xy-badge-yellow">Alert</span>
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout :css-component="true" title="Buttons">
      <template #description>
        Buttons are the best. Clickable. What's not to love.
      </template>

      <ButtonDocs />
    </ComponentLayout>

    <ComponentLayout :css-component="true" title="Links">
      <template #description>
        These things can really take you places. You'd be a fool to ignore.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="links?.outerHTML" />
        </label>
        <div class="mt-1">
          <a ref="links" href="#" class="xy-link">Take Me Somewhere</a>
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout :css-component="true" title="Typography">
      <template #description> Text. Who needs it? We need it! </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy value="<h1>Header1</h1>" />
        </label>
        <div class="mt-1">
          <h1 class="mb-4">Header1</h1>
          <h1>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta
            feugiat accumsan.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta
            feugiat accumsan.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta
            feugiat accumsan.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta
            feugiat accumsan.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta
            feugiat accumsan.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta
            feugiat accumsan.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta
            feugiat accumsan.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta
            feugiat accumsan.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras porta
            feugiat accumsan.
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
            adipiscing elit. In non viverra neque. Ut eleifend in massa faucibus
            hendrerit. Vivamus suscipit pulvinar pharetra. In convallis vel nunc
            ac semper. Proin mollis ac dui a vehicula. Aenean odio libero,
            varius id justo sed, aliquam scelerisque ante. Vestibulum ante ipsum
            primis in faucibus orci luctus et ultrices posuere cubilia curae;
            Aliquam erat volutpat. Vestibulum ac purus ut dolor efficitur
            pharetra.
          </p>
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout :css-component="true" title="Fonts">
      <template #description
        >There are two fonts available. Open Sans (font-sans) is the default
        interface font and should be used for most things. Work Sans
        (font-display) is useful for small interface features like buttons and
        stand-out title and headings. Think of it as the brand typeface, but use
        it sparingly as Open Sans is a better general use typeface for
        interfaces.</template
      >

      <div class="space-y-10">
        <div
          v-for="(name, typeface) in typefaces"
          :key="typeface"
          class="space-y-10"
        >
          <div>
            <h5 class="text-lg font-semibold text-gray-900 mb-2">
              {{ name }} Font Sizes
            </h5>

            <div class="space-y-5">
              <div v-for="size in fontSizes" :key="`${typeface}-${size}`">
                <div class="text-sm text-gray-700">{{ size }}</div>
                <div :class="[size, typeface, 'font-normal bg-gray-100']">
                  The quick brown fox jumps over the lazy dog.
                </div>
              </div>
            </div>
          </div>

          <div>
            <h5 class="text-lg font-semibold text-gray-900 mb-2">
              {{ name }} Font Weights
            </h5>
            <div class="space-y-5">
              <div v-for="weight in weights" :key="`${typeface}-${weight}`">
                <div class="text-sm text-gray-700">{{ weight }}</div>
                <div :class="[weight, typeface, 'text-xl bg-gray-100']">
                  The quick brown fox jumps over the lazy dog.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout :css-component="true" title="Rounded">
      <template #description>
        An experimental border-radius utility for matching rounded corners with
        the brand design language.
      </template>
      <Rounded />
    </ComponentLayout>
  </div>
</template>
