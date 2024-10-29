<script setup lang="ts">
import {
  Switch,
  SwitchGroup,
  SwitchLabel,
  SwitchDescription,
} from "@headlessui/vue"
import InputLabel from "@/lib-components/forms/InputLabel.vue"
import InputHelp from "@/lib-components/forms/InputHelp.vue"
import { defaultModelOpts, hasAttribute } from "@/composables/forms"
import { computed, useAttrs } from "vue"

defineOptions({
  inheritAttrs: false,
})

withDefaults(
  defineProps<{
    label?: string
    help?: string
  }>(),
  {
    label: "",
    help: "",
  }
)

const switchState = defineModel<boolean>(defaultModelOpts)

const attrs = useAttrs()
const isDisabled = computed(() => {
  return hasAttribute(attrs, "disabled")
})
</script>
<template>
  <SwitchGroup as="div" class="flex items-start">
    <Switch
      v-model="switchState"
      :class="[
        switchState ? 'bg-xy-blue' : 'bg-gray-200',
        isDisabled ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer',
        'relative inline-flex shrink-0 h-6 w-11 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-xy-blue-500',
      ]"
      :disabled="isDisabled"
    >
      <span v-if="!label" class="sr-only">Use</span>
      <span
        aria-hidden="true"
        :class="[
          switchState ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
        ]"
      />
    </Switch>

    <div class="ml-3 mt-0.5">
      <SwitchLabel v-if="label">
        <InputLabel
          :label="label"
          :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
        />
      </SwitchLabel>

      <SwitchDescription v-if="help">
        <InputHelp :text="help" />
      </SwitchDescription>
    </div>
  </SwitchGroup>
</template>
