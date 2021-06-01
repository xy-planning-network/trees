<template>
  <div class="relative bg-white py-16 sm:py-24 lg:py-32">
    <div
      class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl"
    >
      <h2
        class="text-base font-semibold tracking-wider text-blue-600 uppercase"
      >
        Build faster with consistency
      </h2>
      <p
        class="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl"
      >
        XY Technology UI Kit
      </p>
      <p class="mt-5 max-w-prose mx-auto text-xl text-gray-500">
        Everything you need to build your app. Get excited!
      </p>

      <div class="mt-12">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="feature in features" :key="feature.name" class="pt-6">
            <div
              class="flow-root bg-gray-50 rounded-lg px-6 pb-8 cursor-pointer hover:bg-gray-100"
              @click="update(feature.name)"
            >
              <div class="-mt-6">
                <div>
                  <span
                    class="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg"
                  >
                    <component
                      :is="feature.icon"
                      class="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </span>
                </div>
                <h3
                  class="mt-8 text-lg font-medium text-gray-900 tracking-tight"
                  v-text="feature.name"
                ></h3>
                <p
                  class="mt-5 text-base text-gray-500"
                  v-text="feature.description"
                ></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="mt-12 bg-blue-800 rounded-lg">
        <div class="max-w-7xl mx-auto md:grid md:grid-cols-2 md:px-6 lg:px-8">
          <div
            class="py-12 px-4 sm:px-6 md:flex md:flex-col md:py-16 md:pl-0 md:pr-10 md:border-r md:border-blue-900 lg:pr-16"
          >
            <blockquote class="mt-6 md:flex-grow md:flex md:flex-col">
              <div class="relative text-lg font-medium text-white md:flex-grow">
                <svg
                  class="absolute top-0 left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                >
                  <path
                    d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"
                  />
                </svg>
                <div class="relative">
                  Do I need to be liked? Absolutely not. I like to be liked. I
                  enjoy being liked. I have to be liked. But it’s not like this
                  compulsive need like my need to be praised.
                </div>
              </div>
              <footer class="mt-8">
                <div class="flex items-start">
                  <div
                    class="flex-shrink-0 inline-flex rounded-full border-2 border-white"
                  >
                    <img
                      class="h-12 w-12 rounded-full"
                      src="https://4e5jbr2e8ha51iaeaa2xu4qj-wpengine.netdna-ssl.com/wp-content/uploads/2020/11/Taylor-Deardorff.png"
                      alt=""
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-base font-medium text-white">
                      Taylor Deardorff
                    </div>
                    <div class="text-base font-medium text-blue-200">
                      Product Stuff
                    </div>
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>
          <div
            class="py-12 px-4 border-t-2 border-blue-900 sm:px-6 md:py-16 md:pr-0 md:pl-10 md:border-t-0 md:border-l lg:pl-16"
          >
            <blockquote class="mt-6 md:flex-grow md:flex md:flex-col">
              <div class="relative text-lg font-medium text-white md:flex-grow">
                <svg
                  class="absolute top-0 left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path
                    d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"
                  />
                </svg>
                <div class="relative">
                  Guess what, I have flaws. What are they? I don’t know. I sing
                  in the shower. I spend too much time volunteering.
                  Occasionally I’ll hit somebody with my car. So sue me.
                </div>
              </div>
              <footer class="mt-8">
                <div class="flex items-start">
                  <div
                    class="flex-shrink-0 inline-flex rounded-full border-2 border-white"
                  >
                    <img
                      class="h-12 w-12 rounded-full"
                      src="https://4e5jbr2e8ha51iaeaa2xu4qj-wpengine.netdna-ssl.com/wp-content/uploads/2020/11/Jillian-Berry.png"
                      alt=""
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-base font-medium text-white">
                      Jillian Berry
                    </div>
                    <div class="text-base font-medium text-blue-200">
                      Design Stuff
                    </div>
                  </div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Emit, Options, Vue } from "vue-property-decorator";
import {
  CollectionIcon,
  ColorSwatchIcon,
  DocumentTextIcon,
  LocationMarkerIcon,
  TableIcon,
  UserGroupIcon,
} from "@heroicons/vue/outline";

@Options({ name: "Home" })
export default class Home extends Vue {
  @Emit("update")
  update(value: string): string {
    return value;
  }

  features = [
    {
      name: "Forms",
      icon: DocumentTextIcon,
      description:
        "Forms are the bread and butter of any application. Get with it and check this shit out.",
    },
    {
      name: "Navigation",
      icon: LocationMarkerIcon,
      description:
        "Let's move around. Change some things. You're looking at this and now you're looking at that.",
    },
    {
      name: "Lists",
      icon: TableIcon,
      description:
        "Do you even know what a list looks like? We've got some examples to dandy.",
    },
    {
      name: "Overlays",
      icon: CollectionIcon,
      description: "Take it over. Emit to the bus. Get it right. Get it tight.",
    },
    {
      name: "Elements",
      icon: ColorSwatchIcon,
      description: "Elements are elemental. Check them out. CSS only.",
    },
    {
      name: "Team",
      icon: UserGroupIcon,
      description:
        "Our team once built something that helped the company, and we've been grateful ever since.",
    },
  ];
}
</script>
