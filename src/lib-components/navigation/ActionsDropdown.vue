<template>
  <Menu as="div" class="relative flex justify-end items-center">
    <MenuButton
      class="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      <span class="sr-only">Open options</span>
      <DotsVerticalIcon class="w-5 h-5" aria-hidden="true" />
    </MenuButton>
    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="z-10 mx-3 origin-top-right absolute right-7 top-0 w-48 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none"
      >
        <div class="py-1">
          <template v-for="(item, idx) in items" :key="idx">
            <MenuItem as="div" v-slot="{ active }" v-if="show(item)">
              <button
                type="submit"
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'block w-full text-left px-4 py-2 text-sm',
                ]"
                v-text="item.label"
                @click="emitEvent(item.event)"
              ></button>
            </MenuItem>
          </template>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { DotsVerticalIcon } from "@heroicons/vue/solid";
import TableTypes from "../../types/table";
import UserTypes from "../../types/users";

@Options({
  components: { DotsVerticalIcon, Menu, MenuButton, MenuItem, MenuItems },
})
export default class NewActionsDropdown extends Vue {
  @Prop({ type: Object, required: true }) currentUser!: UserTypes.User;
  @Prop({ type: Array, required: true }) items!: Array<TableTypes.MenuItem>;
  @Prop({ type: Object, required: true }) propsData!: any;

  emitEvent(event: string): void {
    window.VueBus.emit(event, this.propsData);
  }
  show(item: TableTypes.MenuItem): boolean {
    if (!item.show) return true;
    return item.show(this.propsData, this.currentUser);
  }
}
</script>
