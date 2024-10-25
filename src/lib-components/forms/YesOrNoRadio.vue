<script setup lang="ts">
import FieldsetLegend from "./FieldsetLegend.vue"
import InputLabel from "./InputLabel.vue"
import InputHelp from "./InputHelp.vue"
import InputError from "./InputError.vue"
import {
  useInputField,
  defaultInputProps,
  defaultModelOpts,
} from "@/composables/forms"
import type { BooleanInput } from "@/composables/forms"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<BooleanInput>(), defaultInputProps)
const modelState = defineModel<BooleanInput["modelValue"]>(defaultModelOpts)

const {
  aria,
  isDisabled,
  isRequired,
  nameAttr,
  errorState,
  onInvalid,
  validate,
} = useInputField(props)
</script>

<template>
  <fieldset
    class="space-y-6"
    :aria-labelledby="aria.labelledby"
    :aria-describedby="aria.describedby"
    :aria-errormessage="aria.errormessage"
  >
    <div v-if="label">
      <FieldsetLegend
        :id="aria.labelledby"
        class="block my-auto"
        :label="label"
        :required="isRequired"
        tag="legend"
      />
      <InputHelp
        v-if="help"
        :id="aria.describedby"
        class="mt-1"
        tag="p"
        :text="help"
      />
      <InputError :id="aria.errormessage" class="mt-1" :text="errorState" />
    </div>

    <div>
      <label
        class="inline-flex items-center group"
        :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
        :for="`${nameAttr}-true`"
      >
        <input
          :id="`${nameAttr}-true`"
          v-model="modelState"
          type="radio"
          :class="[
            'h-4 w-4 text-xy-blue cursor-pointer',
            'disabled:bg-gray-100 disabled:border-gray-200  disabled:cursor-not-allowed disabled:opacity-100',
            'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
            errorState
              ? 'border-red-700 focus:ring-red-700'
              : 'border-gray-300  focus:ring-xy-blue-500',
          ]"
          :name="nameAttr"
          :value="true"
          v-bind="$attrs"
          @change="validate"
          @invalid="onInvalid"
        />
        <InputLabel class="ml-3" label="Yes" tag="span" />
      </label>

      <label
        class="inline-flex items-center ml-6"
        :class="isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'"
        :for="`${nameAttr}-false`"
      >
        <input
          :id="`${nameAttr}-false`"
          v-model="modelState"
          type="radio"
          :class="[
            'h-4 w-4 text-xy-blue cursor-pointer',
            'disabled:bg-gray-100 disabled:border-gray-200  disabled:cursor-not-allowed disabled:opacity-100',
            'checked:disabled:bg-xy-blue checked:disabled:border-xy-blue checked:disabled:opacity-50',
            errorState
              ? 'border-red-700 focus:ring-red-700'
              : 'border-gray-300  focus:ring-xy-blue-500',
          ]"
          :name="nameAttr"
          :value="false"
          v-bind="$attrs"
          @change="validate"
          @invalid="onInvalid"
        />
        <InputLabel class="ml-3" label="No" tag="span" />
      </label>
    </div>
  </fieldset>
</template>
