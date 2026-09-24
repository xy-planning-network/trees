<script setup lang="ts">
import { isHttpError } from "@/api/base"
import type { ReqMethod } from "@/api/client"
import { useAppFlasher, useBaseAPI } from "@/composables"
import { statusMessages } from "@/composables/http"
import {
  useFieldsSchema,
  type FieldsSchema,
} from "@/composables/useFieldsSchema"
import FormCell from "@/lib-components/forms/FormCell.vue"
import FormGrid from "@/lib-components/forms/FormGrid.vue"
import FormSection from "@/lib-components/forms/FormSection.vue"

const props = withDefaults(
  defineProps<{
    action: string
    btnText?: string
    btnDisabled?: boolean
    columns: 1 | 2
    filterShow?: boolean
    flashError?: boolean
    flashSuccess?: boolean
    method: ReqMethod
    schema: FieldsSchema
  }>(),
  {
    btnText: "Submit",
    btnDisabled: false,
    filterShow: false,
    flashError: true,
    flashSuccess: true,
  }
)

const emit = defineEmits<{
  error: [error: any]
  success: [result: any]
}>()

const model = defineModel<Record<string, any>>({
  default: () => ({}),
  required: false,
})

const { fieldSections, payload } = useFieldsSchema(model, () => props.schema, {
  filterShow: props.filterShow,
})

const { execute, isLoading } = useBaseAPI(props.action, props.method, {
  withDelay: 500,
})

const submit = () => {
  execute(payload.value)
    .then((d) => {
      if (props.flashSuccess !== false) {
        useAppFlasher.success("Success!")
      }

      emit("success", d)
    })
    .catch((e) => {
      if (props.flashError === false) {
        emit("error", e)
        return
      }

      if (isHttpError(e) && statusMessages[e.status]) {
        useAppFlasher.error(statusMessages[e.status])
      } else {
        useAppFlasher.genericError()
      }

      emit("error", e)
    })
}
</script>

<template>
  <FormGrid
    :btn-disabled="isLoading || btnDisabled"
    :btn-text="btnText"
    :columns="columns"
    @submit.prevent="submit"
  >
    <template v-for="(section, sectionIdx) in fieldSections" :key="sectionIdx">
      <FormSection :title="section.title" :description="section.description">
        <template v-for="input in section.fields" :key="input.name">
          <FormCell
            v-if="input.show"
            :span="input.span || 'full'"
            :start="input.start"
          >
            <component :is="input.$component" v-bind="input.$props" />
          </FormCell>
        </template>
      </FormSection>
    </template>
  </FormGrid>
</template>
