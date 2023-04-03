<script setup lang="ts">
import { ref } from "vue"
import type { Layout, Variant } from "@/lib-components/marketing/BannerCTA.vue"
import BannerCTA from "@/lib-components/marketing/BannerCTA.vue"
import { useAppFlasher } from "@/composables"
import TreesImg from "../assets/trees-square-icon.svg"

const bannerBtnClick = () => {
  useAppFlasher.info("Clicked It!")
}
const layoutOptions = ["stacked", "centered", "justified"].map((v) => {
  return { label: v, value: v }
})
const layout = ref<Layout>("stacked")

const variantOptions = ["neutral", "brand"].map((v) => {
  return { label: v, value: v }
})
const variant = ref<Variant>("neutral")

const bannerCopy = `
<BannerCTA
    upperdeck="Lorem Ipsum Dolor"
    headline="Integer varius orci eu massa lacinia"
    lowerdeck="Quasi est quaerat. Sit molestiae et. Provident ad dolorem occaecati eos iste. Soluta rerum quidem minus ut molestiae velit error quod. Excepturi quidem expedita."
    support="Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat. Quasi aperiam sit non sit neque reprehenderit."
    primary-button-link="#"
    primary-button-text="Lorem Ipsum"
    secondary-button-link="#"
    secondary-button-text="Lorem Ipsum"
    @click:primary.prevent="bannerBtnClick"
    @click:secondary.prevent="bannerBtnClick"
    :layout="layout"
    :variant="variant"
    :img="TreesImg"
/>
`

const bannerCTAProps = [
  { name: "variant", required: false, type: `"neutral" | "brand"` },
  {
    name: "layout",
    required: false,
    type: `"stacked" | "centered" | "justified"`,
  },
  { name: "upperdeck", required: false, type: "string" },
  { name: "headline", required: false, type: "string" },
  { name: "lowerdeck", required: false, type: "string" },
  { name: "support", required: false, type: "string" },
  { name: "primaryButtonText", required: false, type: "string" },
  { name: "primaryButtonLink", required: false, type: "string" },
  { name: "secondaryButtonText", required: false, type: "string" },
  { name: "secondaryButtonLink", required: false, type: "string" },
  { name: "img", required: false, type: "string" },
]

const bannerCTAEvents = [
  { name: "click:primary", args: "Event" },
  { name: "click:secondary", args: "Event" },
]
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="mx-auto">
      <ComponentLayout :css-component="false" title="CTA Banner">
        <template v-slot:description
          >In both branded and neutral variants, along with three layouts, and a
          host of optional properties for copy you can construct a number of
          banner styles that'll encourage clicks. Oh, and did I mention you can
          have a primary and a secondary call to action, so you're never without
          places to send them. Note that the stacked layout is the only layout
          that supports the <code>img</code> prop.</template
        >

        <div
          class="space-y-6 lg:space-y-0 lg:flex lg:gap-x-3 lg:items-center lg:justify-between"
        >
          <div>
            <Radio
              v-model="layout"
              :columns="3"
              :options="layoutOptions"
              legend="Layout"
            />
          </div>
          <div>
            <Radio
              v-model="variant"
              :columns="3"
              :options="variantOptions"
              legend="Variant"
            />
          </div>
        </div>

        <div class="space-y-12">
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="bannerCopy" />
          </label>

          <BannerCTA
            upperdeck="Philosophize With Me"
            headline="Thought Experiment Of The Day"
            lowerdeck="If a tree falls in a forest and no one is around to hear it, does it make a sound?"
            support="The age-old question of whether a falling tree makes a sound when there’s no one around to hear it exploits the tension between perception and reality. Explore possible answers and their consequences."
            primary-button-link="https://philosophybreak.com/articles/if-a-tree-falls-in-the-forest-and-theres-no-one-around-to-hear-it-does-it-make-a-sound/"
            primary-button-text="Tell Me More"
            secondary-button-link="https://www.nsta.org/q-if-tree-falls-forest-and-theres-no-one-around-hear-it-does-it-make-sound"
            secondary-button-text="Get Real Though"
            :layout="layout"
            :variant="variant"
            :img="TreesImg"
          />

          <PropsTable :props="bannerCTAProps" />

          <EventsTable :props="bannerCTAEvents" />

          <div>
            <h3 class="mb-2">
              You often won't need an upperdeck or support copy.
            </h3>
            <BannerCTA
              headline="Integer varius orci eu massa lacinia"
              lowerdeck="Quasi est quaerat. Sit molestiae et. Provident ad dolorem occaecati eos iste. Soluta rerum quidem minus ut molestiae velit error quod. Excepturi quidem expedita."
              primary-button-link="#"
              primary-button-text="Lorem Ipsum"
              secondary-button-link="#"
              secondary-button-text="Lorem Ipsum"
              @click:primary.prevent="bannerBtnClick"
              @click:secondary.prevent="bannerBtnClick"
              :layout="layout"
              :variant="variant"
              :img="TreesImg"
            />
          </div>

          <div>
            <h3 class="mb-2">
              Tone it down by dropping the lowerdeck and only using support
              copy.
            </h3>

            <BannerCTA
              headline="Integer varius orci eu massa lacinia"
              support="Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat. Quasi aperiam sit non sit neque reprehenderit."
              primary-button-link="#"
              primary-button-text="Lorem Ipsum"
              secondary-button-link="#"
              secondary-button-text="Lorem Ipsum"
              @click:primary.prevent="bannerBtnClick"
              @click:secondary.prevent="bannerBtnClick"
              :layout="layout"
              :variant="variant"
              :img="TreesImg"
            />
          </div>

          <div>
            <h3 class="mb-2">
              Make it big - crafted to support inherited padding and min-height
              classes from tailwind.
            </h3>
            <BannerCTA
              class="py-24"
              headline="Integer varius orci eu massa lacinia"
              support="Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat."
              primary-button-link="#"
              primary-button-text="Lorem Ipsum"
              @click:primary.prevent="bannerBtnClick"
              :layout="layout"
              :variant="variant"
            />
          </div>
        </div>
      </ComponentLayout>
    </div>
  </div>
</template>
