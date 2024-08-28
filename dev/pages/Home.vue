<script setup lang="ts">
import { computed } from "vue"
import { pages } from "../pages"

const features = computed(() => {
  return pages.filter((p) => p.name != "Home")
})
</script>

<template>
  <div class="relative">
    <div
      class="mx-auto max-w-md px-4 text-center sm:max-w-3xl sm:px-6 lg:px-8 lg:max-w-7xl"
    >
      <h2 class="text-base font-semibold tracking-wider text-xy-blue uppercase">
        Build faster with consistency
      </h2>
      <p
        class="mt-2 text-3xl font-extrabold text-gray-900 font-display sm:text-4xl"
      >
        XY Technology UI Kit
      </p>
      <p class="mt-5 max-w-prose mx-auto text-xl text-gray-700">
        Everything you need to build your app. Get excited!
      </p>

      <div class="mt-12">
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="feature in features" :key="feature.name" class="pt-6">
            <a
              :href="feature.url"
              class="flow-root bg-gray-50 shadow rounded-lg px-6 pb-8 cursor-pointer hover:bg-gray-100"
            >
              <div class="-mt-6">
                <div>
                  <span
                    class="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg"
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
                  class="mt-5 text-base text-gray-700"
                  v-text="feature.description"
                ></p>
              </div>
            </a>
          </div>
        </div>
      </div>

      <section class="mt-12 bg-blue-900 rounded-lg">
        <div class="max-w-7xl mx-auto md:grid md:grid-cols-2 md:px-6 lg:px-8">
          <div
            class="py-12 px-4 sm:px-6 md:flex md:flex-col md:py-16 md:pl-0 md:pr-10 md:border-r md:border-xy-blue-50/50 lg:pr-16"
          >
            <blockquote class="mt-6 md:grow md:flex md:flex-col">
              <div class="relative text-lg font-medium text-white md:grow">
                <svg
                  class="absolute top-0 left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-xy-blue-600"
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
                    class="shrink-0 inline-flex rounded-full border-2 border-white"
                  >
                    <img
                      class="h-12 w-12 rounded-full"
                      src="https://s3.amazonaws.com/shecodesio-production/students/avatars/000/020/285/medium/Z00CLp0K_400x400.jpg?1610918116"
                      alt=""
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-base font-medium text-white">
                      Taylor Deardorff
                    </div>
                    <div class="text-base font-medium text-xy-blue-50">
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
            <blockquote class="mt-6 md:grow md:flex md:flex-col">
              <div class="relative text-lg font-medium text-white md:grow">
                <svg
                  class="absolute top-0 left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-xy-blue-600"
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
                    class="shrink-0 inline-flex rounded-full border-2 border-white"
                  >
                    <img
                      class="h-12 w-12 rounded-full"
                      src="https://content.malakye.com/media/uploads/images/personalprofiles/thumbs/742194_637214344006622155.png"
                      alt=""
                    />
                  </div>
                  <div class="ml-4">
                    <div class="text-base font-medium text-white">
                      Jillian Berry
                    </div>
                    <div class="text-base font-medium text-xy-blue-50">
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
