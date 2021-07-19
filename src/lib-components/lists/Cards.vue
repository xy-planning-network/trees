<template>
  <div
    class="mt-5 grid grid-cols-1 gap-5"
    :class="'lg:grid-cols-' + cards.length"
  >
    <div
      class="bg-white overflow-hidden shadow rounded-lg"
      v-for="(card, idx) in cards"
      :key="idx"
    >
      <div class="px-4 py-5 sm:p-6 text-center">
        <dl>
          <dd
            class="mt-1 text-3xl leading-9 font-semibold text-xy-blue"
            v-text="card.primary"
          ></dd>
          <dt
            class="text-sm leading-5 font-medium text-gray-500 truncate"
            v-text="card.secondary"
          ></dt>
        </dl>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Prop, Vue } from "vue-property-decorator";

@Options({ name: "Cards" })
export default class Cards extends Vue {
  @Prop({ type: Array, required: true }) cards!: {
    primary: string;
    secondary: string;
  }[];
}
</script>
