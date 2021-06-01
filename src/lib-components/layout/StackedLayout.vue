<template>
  <div class="min-h-screen bg-gray-100">
    <Disclosure as="nav" class="bg-white shadow-sm" v-slot="{ open }">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <img class="block h-8 w-auto" :src="iconURL" alt="XY Trees" />
            </div>
            <div class="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
              <a
                v-for="item in navigation"
                :key="item.name"
                :href="item.url"
                :class="[
                  isActive(item.url)
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium',
                ]"
                :aria-current="isActive(item.url) ? 'page' : undefined"
                >{{ item.name }}</a
              >
            </div>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:items-center">
            <!-- Profile dropdown -->
            <Menu as="div" class="ml-3 relative">
              <div>
                <MenuButton
                  class="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <span class="sr-only">Open user menu</span>
                  <UserCircleIcon class="text-gray-500 h-8 w-8 rounded-full" />
                </MenuButton>
              </div>
              <transition
                enter-active-class="transition ease-out duration-200"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <MenuItems
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <MenuItem
                    v-for="item in userNavigation"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <a
                      :href="item.url"
                      :class="[
                        active ? 'bg-gray-100' : '',
                        'block px-4 py-2 text-sm text-gray-700',
                      ]"
                      >{{ item.name }}</a
                    >
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>
          </div>
          <div class="-mr-2 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <DisclosureButton
              class="bg-white inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span class="sr-only">Open main menu</span>
              <MenuIcon v-if="!open" class="block h-6 w-6" aria-hidden="true" />
              <XIcon v-else class="block h-6 w-6" aria-hidden="true" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      <DisclosurePanel class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <a
            v-for="item in navigation"
            :key="item.name"
            :href="item.url"
            :class="[
              isActive(item.url)
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
              'block pl-3 pr-4 py-2 border-l-4 text-base font-medium',
            ]"
            :aria-current="isActive(item.url) ? 'page' : undefined"
            >{{ item.name }}</a
          >
        </div>
        <div class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <UserCircleIcon class="text-gray-500 h-10 w-10 rounded-full" />
            </div>
            <div class="ml-3">
              <div
                class="text-base font-medium text-gray-800"
                v-text="currentUser.name"
              ></div>
              <div
                class="text-sm font-medium text-gray-500"
                v-text="currentUser.email"
              ></div>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <a
              v-for="item in userNavigation"
              :key="item.name"
              :href="item.url"
              class="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >{{ item.name }}</a
            >
          </div>
        </div>
      </DisclosurePanel>
    </Disclosure>

    <slot name="header"></slot>

    <main>
      <div class="mx-auto sm:px-6 lg:px-8">
        <!-- Replace with your content -->
        <div class="px-4 py-8 sm:px-0">
          <slot></slot>
        </div>
        <!-- /End replace -->
      </div>
    </main>
  </div>

  <Flash />
  <Spinner />
</template>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";
import Flash from "../overlays/Flash.vue";
import Spinner from "../overlays/Spinner.vue";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import {
  BellIcon,
  MenuIcon,
  UserCircleIcon,
  XIcon,
} from "@heroicons/vue/outline";
import NavTypes from "../../types/nav";
import UserTypes from "../../types/users";

@Options({
  components: {
    Flash,
    Spinner,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    BellIcon,
    MenuIcon,
    UserCircleIcon,
    XIcon,
  },
  name: "StackedLayout",
})
export default class StackedLayout extends Vue {
  @Prop({ type: String, required: false }) activeURL?: string;
  @Prop({ type: Object, required: true }) currentUser!: UserTypes.User;
  @Prop({ type: String, required: true }) iconURL!: string;
  @Prop({ type: Array, required: true }) navigation!: NavTypes.Item[];
  @Prop({ type: Array, required: true }) userNavigation!: NavTypes.Item[];

  sidebarOpen = false;

  isActive(url: string): boolean {
    return this.activeURL === url;
  }
}
</script>
