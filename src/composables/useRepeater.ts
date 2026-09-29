import { ref, type Component, type Ref } from "vue"
import type {
  DisplayInput,
  FieldsSchemaInput,
} from "@/composables/useFieldsSchema"
import getProperty from "@/helpers/GetProperty"
import setProperty from "@/helpers/SetProperty"
import RepeaterDisplay from "@/lib-components/forms/RepeaterDisplay.vue"

/**
 * Removes repeater-owned properties from every supported input type while
 * keeping required properties such as `options`.
 */
type RepeaterSchemaInput<T, K extends PropertyKey> = T extends unknown
  ? Omit<T, Extract<keyof T, K>>
  : never

/**
 * The input repeated by a field repeater. Its name and value come from the
 * repeater definition.
 */
export type RepeaterInput = RepeaterSchemaInput<
  FieldsSchemaInput,
  "name" | "modelValue"
>

/**
 * An input inside a collection row. Names are relative to the row, and initial
 * values come from the repeater model.
 */
export type RepeaterCollectionInput = RepeaterSchemaInput<
  FieldsSchemaInput,
  "modelValue"
>

export type IndexPosition = "prefix" | "suffix"

export interface RepeaterBase<T> {
  type: "repeater"
  name: string
  modelValue?: T[]
  title?: string
  help?: string
  /**
   * Adds an visible index to labels at the specified position
   * e.g. Email 1, Email 2 | 1. Contact, 2. Contact
   */
  indexPosition?: IndexPosition
  /**
   * Limits Add/Remove actions and validates the number of items. Existing model
   * values are shown as-is, even when they fall outside these limits.
   */
  min?: number
  max?: number
  addText?: string
  disabled?: boolean
  span?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full"
  start?: boolean
  show?: boolean
}

/**
 * Repeats one input and stores each input's value in the resulting array.
 *
 * @example
 * {
 *   type: "repeater",
 *   name: "phone_numbers",
 *   title: "Phone numbers",
 *   help: "Add each number where you can be reached.",
 *   indexPosition: "suffix",
 *   addText: "Add phone number",
 *   field: { type: "tel", label: "Phone number" }
 * }
 */
export interface FieldRepeater extends RepeaterBase<unknown> {
  field: RepeaterInput
  fields?: never
}

/**
 * Repeats a set of named inputs and stores each row as an object. Nested
 * repeaters are not supported.
 *
 * @example
 * {
 *   type: "repeater",
 *   name: "household_members",
 *   title: "Household members",
 *   itemTitle: "Household member",
 *   help: "Include everyone who lives in your household.",
 *   indexPosition: "prefix",
 *   min: 1,
 *   fields: [
 *     { type: "text", name: "name", label: "Name" },
 *     { type: "number", name: "age", label: "Age" }
 *   ]
 * }
 */
export interface CollectionRepeater extends RepeaterBase<Record<string, any>> {
  field?: never
  itemTitle?: string
  fields: RepeaterCollectionInput[]
}

export type Repeater = FieldRepeater | CollectionRepeater

/** A repeater with the component properties needed for display. */
export type DisplayRepeater = Repeater & {
  $component: Component
  $props: Record<string, any>
  show: boolean
}

/**
 * Returns true when a schema field repeats one input.
 */
export const isFieldRepeater = (field: any): field is FieldRepeater => {
  return (
    typeof field === "object" &&
    field !== null &&
    field.type === "repeater" &&
    Object.prototype.hasOwnProperty.call(field, "field") &&
    !Object.prototype.hasOwnProperty.call(field, "fields")
  )
}

/**
 * Returns true when a schema field repeats a collection of inputs.
 */
export const isCollectionRepeater = (
  field: any
): field is CollectionRepeater => {
  return (
    typeof field === "object" &&
    field !== null &&
    field.type === "repeater" &&
    Object.prototype.hasOwnProperty.call(field, "fields") &&
    !Object.prototype.hasOwnProperty.call(field, "field")
  )
}

export interface RowField {
  key: string
  input: DisplayInput
}

export interface RepeaterRow {
  key: string
  type: "field" | "collection"
  title?: string
  fields: RowField[]
}

/**
 * Builds repeater rows for display and handles adding, updating, and removing
 * their values. Used by useFieldsSchema.
 */
export const useRepeater = (
  model: Ref<Record<string, any>>,
  toDisplayInput: (
    input: FieldsSchemaInput,
    onUpdate?: ($val: any) => void
  ) => DisplayInput
): {
  toDisplayRepeater: (repeater: Repeater) => DisplayRepeater
} => {
  let nextRowKey = 0
  // Keep row keys stable as items are added and removed.
  const rowKeys = new Map<string, string[]>()

  // Add/Remove can change the empty UI row without changing the model.
  const rowState = ref(new Map<string, "added" | "removed">())

  // Reuse existing keys and add or trim them to match the rendered rows.
  const getRowKeys = (name: string, count: number): string[] => {
    const keys = rowKeys.get(name) || []

    while (keys.length < count) {
      nextRowKey += 1
      keys.push(`${name}-${nextRowKey}`)
    }

    if (keys.length > count) {
      keys.splice(count)
    }

    rowKeys.set(name, keys)
    return keys
  }

  const getValue = (repeater: Repeater): any[] | undefined => {
    const value = getProperty(model.value, repeater.name, undefined)
    return Array.isArray(value) ? value : undefined
  }

  const addIndex = (
    text: string | undefined,
    index: number,
    position: Repeater["indexPosition"]
  ): string | undefined => {
    if (!text || !position) {
      return text
    }

    const number = index + 1
    return position === "prefix" ? `${number}. ${text}` : `${text} ${number}`
  }

  const updateValue = (
    repeater: Repeater,
    isEmptyRow: boolean,
    name: string,
    $val: any
  ) => {
    model.value = setProperty(model.value, name, $val)

    if (isEmptyRow) {
      // The row is in the model, so remove from display state.
      rowState.value.delete(repeater.name)
    }
  }

  const addItem = (
    repeater: Repeater,
    rowCount: number,
    hasEmptyRow: boolean,
    max: number
  ) => {
    if (repeater.disabled || hasEmptyRow || rowCount >= max) {
      return
    }

    rowState.value.set(repeater.name, "added")
  }

  const removeRowKey = (name: string, index: number) => {
    rowKeys.get(name)?.splice(index, 1)
  }

  const removeItem = (repeater: Repeater, index: number) => {
    if (repeater.disabled) {
      return
    }

    const value = getValue(repeater)

    if (value === undefined) {
      rowState.value.set(repeater.name, "removed")
      removeRowKey(repeater.name, index)
      return
    }

    if (index === value.length) {
      rowState.value.delete(repeater.name)
      removeRowKey(repeater.name, index)
      return
    }

    const min = repeater.min ?? 0

    if (value.length <= min) {
      return
    }

    const updated = [...value]

    updated.splice(index, 1)
    removeRowKey(repeater.name, index)
    model.value = setProperty(model.value, repeater.name, updated)
  }

  const toDisplayRepeater = (repeater: Repeater): DisplayRepeater => {
    const value = getValue(repeater)
    const max = repeater.max ?? Number.POSITIVE_INFINITY
    const valueCount = value?.length || 0

    // Show one empty row before the repeater has a model value. Add can also
    // show an empty row without updating the model until the user enters a value.
    const state = rowState.value.get(repeater.name)
    const hasRoom = valueCount < max
    const rowWasAdded = state === "added"
    const showInitialRow = value === undefined && state !== "removed"
    const hasEmptyRow = hasRoom && (rowWasAdded || showInitialRow)
    const rowCount = valueCount + (hasEmptyRow ? 1 : 0)
    const keys = getRowKeys(repeater.name, rowCount)

    const rows: RepeaterRow[] = keys.map((key, index) => {
      const isEmptyRow = hasEmptyRow && index === valueCount

      if (isFieldRepeater(repeater)) {
        const name = `${repeater.name}.${index}`
        const input: FieldsSchemaInput = {
          ...repeater.field,
          name,
          label: addIndex(repeater.field.label, index, repeater.indexPosition),
          ...(repeater.disabled ? { disabled: true } : {}),
        }

        return {
          key,
          type: "field",
          fields: [
            {
              key: "field",
              input: toDisplayInput(input, ($val) => {
                updateValue(repeater, isEmptyRow, name, $val)
              }),
            },
          ],
        }
      }

      return {
        key,
        type: "collection",
        title: repeater.itemTitle
          ? addIndex(repeater.itemTitle, index, repeater.indexPosition)
          : repeater.indexPosition
          ? addIndex(repeater.title, index, repeater.indexPosition)
          : undefined,
        fields: repeater.fields.map((field) => {
          const name = `${repeater.name}.${index}.${field.name}`
          const input: FieldsSchemaInput = {
            ...field,
            name,
            ...(repeater.disabled ? { disabled: true } : {}),
          }

          return {
            key: field.name,
            input: toDisplayInput(input, ($val) => {
              updateValue(repeater, isEmptyRow, name, $val)
            }),
          }
        }),
      }
    })

    return {
      ...repeater,
      $component: RepeaterDisplay,
      $props: {
        type: isFieldRepeater(repeater) ? "field" : "collection",
        title: repeater.title,
        help: repeater.help,
        count: valueCount,
        min: repeater.min,
        max: repeater.max,
        rows,
        addText: repeater.addText ?? "Add",
        addDisabled:
          Boolean(repeater.disabled) || hasEmptyRow || rowCount >= max,
        removeDisabled: Boolean(repeater.disabled),
        onAdd: () => addItem(repeater, rowCount, hasEmptyRow, max),
        onRemove: (index: number) => removeItem(repeater, index),
      },
      show: typeof repeater.show === "boolean" ? repeater.show : true,
    }
  }

  return { toDisplayRepeater }
}
