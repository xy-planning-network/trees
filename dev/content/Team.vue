<script setup lang="ts">
const people = [
  {
    name: "David Ketch",
    role: "Senior Software Engineer",
    imageUrl: "https://i1.sndcdn.com/artworks-000349846200-olt9ar-t500x500.jpg",
    bio: "David brings gifts when he travels but will likely loose his bag and blame the airline industry. Someone needs to talk to him about this.",
    twitterUrl: "https://twitter.com/davidlarsketch?lang=en",
    linkedinUrl: "https://www.linkedin.com/in/davidlarsketch",
  },
  {
    name: "Jillian Berry",
    role: "Product Designer",
    imageUrl:
      "https://content.malakye.com/media/uploads/images/personalprofiles/thumbs/742194_637214344006622155.png",
    bio: "Jillian is frank as a frog. She forgets her shoes to the office from time to time, but it's ok.",
    twitterUrl: "",
    linkedinUrl: "https://www.linkedin.com/in/jillian-berry-0b978474",
  },
  {
    name: "Joseph Timmer",
    role: "Principal Software Engineer",
    imageUrl:
      "https://pbs.twimg.com/profile_images/3222845749/b00f32440bc787fb26ec5d7286c4afe3_400x400.jpeg",
    bio: "Joe can really get after it, but watch out if he's riding on a lawn mower.",
    twitterUrl: "https://twitter.com/ProfSmallPine",
    linkedinUrl: "https://www.linkedin.com/in/profsmallpine",
  },
  {
    name: "Taylor Deardorff",
    role: "Product Owner",
    imageUrl:
      "https://s3.amazonaws.com/shecodesio-production/students/avatars/000/020/285/medium/Z00CLp0K_400x400.jpg?1610918116",
    bio: "Taylor comes to the field from the world of underwater engineering. Watch out for when thinks something is cool.",
    twitterUrl: "https://twitter.com/TayDeeeee",
    linkedinUrl: "",
  },
]
</script>
<template>
  <div class="mx-auto py-12 px-4 max-w-7xl sm:px-6 lg:px-8 lg:py-24">
    <div class="space-y-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
      <div class="space-y-5 sm:space-y-4">
        <h2 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
          About Us
        </h2>
        <p class="text-xl text-gray-700">
          We get shit done. Tasked with building tech, we seek quality
          experiences. We recognize the said state of affairs in tech, and we
          operate with the goal of creating tools that get out of the way for
          those in the financial space. We strive for consistency, and we fix
          the little niggles.
        </p>
      </div>
      <div class="lg:col-span-2">
        <ul
          class="space-y-12 sm:divide-y sm:divide-gray-200 sm:space-y-0 sm:-mt-8 lg:gap-x-8 lg:space-y-0"
        >
          <li v-for="person in people" :key="person.name" class="sm:py-8">
            <div
              class="space-y-4 sm:grid sm:grid-cols-3 sm:items-start sm:gap-6 sm:space-y-0"
            >
              <div class="aspect-[3/2] sm:aspect-[3/4] overflow-hidden">
                <img
                  class="h-full w-full object-cover shadow-lg rounded-lg"
                  :src="person.imageUrl"
                  alt=""
                />
              </div>
              <div class="sm:col-span-2">
                <div class="space-y-4">
                  <div class="text-lg leading-6 font-medium space-y-1">
                    <h3>{{ person.name }}</h3>
                    <p class="text-blue-500">{{ person.role }}</p>
                  </div>
                  <div class="text-lg">
                    <p class="text-gray-900">{{ person.bio }}</p>
                  </div>
                  <ul class="flex space-x-5">
                    <li v-if="person.twitterUrl">
                      <a
                        :href="person.twitterUrl"
                        class="text-gray-700 hover:text-gray-900"
                      >
                        <span class="sr-only">Twitter</span>
                        <svg
                          class="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84"
                          />
                        </svg>
                      </a>
                    </li>
                    <li v-if="person.linkedinUrl">
                      <a
                        :href="person.linkedinUrl"
                        class="text-gray-700 hover:text-gray-900"
                      >
                        <span class="sr-only">LinkedIn</span>
                        <svg
                          class="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
