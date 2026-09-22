<script setup lang="ts">
import {
  useFieldsSchema,
  type FieldsSchema,
} from "@/composables/useFieldsSchema"
import FormCell from "@/lib-components/forms/FormCell.vue"
import FormGrid from "@/lib-components/forms/FormGrid.vue"
import FormSection from "@/lib-components/forms/FormSection.vue"

const props = defineProps<{
  columns: 1 | 2
  schema: FieldsSchema
}>()

const model = defineModel<Record<string, any>>({ required: true })

const { fieldSections } = useFieldsSchema(model, () => props.schema)
</script>

<template>
  <FormGrid as="div" :columns="columns">
    <template v-for="(section, sectionIdx) in fieldSections" :key="sectionIdx">
      <FormSection :title="section.title" :description="section.description">
        <template v-for="(input, idx) in section.fields" :key="idx">
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
