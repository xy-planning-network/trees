import { reactive, type Ref } from "vue"
import type {
  FieldsSchemaInput,
  FieldsSchemaRepeater,
} from "@/composables/useFieldsSchema"
import getProperty from "@/helpers/GetProperty"
import setProperty from "@/helpers/SetProperty"
import RepeaterDisplay from "@/lib-components/forms/RepeaterDisplay.vue"

export interface ResolvedRepeaterField {
  key: string
  input: FieldsSchemaInput
}

export type ResolvedRepeaterType = "field" | "collection"

export interface ResolvedRepeaterRow {
  key: string
  type: ResolvedRepeaterType
  title?: string
  fields: ResolvedRepeaterField[]
}

type ResolveInput = (
  input: FieldsSchemaInput,
  onUpdate?: ($val: any) => void
) => FieldsSchemaInput

/**
 * useRepeater resolves FieldSchema repeaters and owns their model mutations
 * and stable row identifiers. It is an internal implementation detail of
 * useFieldsSchema rather than a public composable.
 */
export const useRepeater = (
  model: Ref<Record<string, any>>,
  resolveInput: ResolveInput
): {
  resolveRepeater: (repeater: FieldsSchemaRepeater) => FieldsSchemaRepeater
} => {
  let nextRowKey = 0
  const rowKeys = new Map<string, string[]>()
  const emptyRowState = reactive(new Map<string, "added" | "removed">())

  const syncRowKeys = (name: string, count: number): string[] => {
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

  const getValue = (repeater: FieldsSchemaRepeater): any[] | undefined => {
    const value = getProperty(model.value, repeater.name, undefined)
    return Array.isArray(value) ? value : undefined
  }

  const addIndex = (
    text: string | undefined,
    index: number,
    position: FieldsSchemaRepeater["indexPosition"]
  ): string | undefined => {
    if (!text || !position) {
      return text
    }

    const number = index + 1
    return position === "prefix" ? `${number}. ${text}` : `${text} ${number}`
  }

  const updateValue = (
    repeater: FieldsSchemaRepeater,
    isEmptyRow: boolean,
    name: string,
    $val: any
  ) => {
    model.value = setProperty(model.value, name, $val)

    if (isEmptyRow) {
      emptyRowState.delete(repeater.name)
    }
  }

  const addItem = (
    repeater: FieldsSchemaRepeater,
    rowCount: number,
    hasEmptyRow: boolean,
    max: number
  ) => {
    if (repeater.disabled || hasEmptyRow || rowCount >= max) {
      return
    }

    emptyRowState.set(repeater.name, "added")
  }

  const removeItem = (
    repeater: FieldsSchemaRepeater,
    rowCount: number,
    min: number,
    index: number,
    value: unknown[] | undefined,
    hasEmptyRow: boolean
  ) => {
    if (
      repeater.disabled ||
      rowCount <= min ||
      index < 0 ||
      index >= rowCount
    ) {
      return
    }

    if (hasEmptyRow && index === (value?.length ?? 0)) {
      if (value === undefined) {
        emptyRowState.set(repeater.name, "removed")
      } else {
        emptyRowState.delete(repeater.name)
      }

      syncRowKeys(repeater.name, rowCount).splice(index, 1)
      return
    }

    if (value === undefined) {
      return
    }

    const updated = [...value]

    updated.splice(index, 1)
    syncRowKeys(repeater.name, rowCount).splice(index, 1)
    model.value = setProperty(model.value, repeater.name, updated)
  }

  const resolveRepeater = (
    repeater: FieldsSchemaRepeater
  ): FieldsSchemaRepeater => {
    const value = getValue(repeater)
    const min = repeater.min ?? 0
    const max = repeater.max ?? Number.POSITIVE_INFINITY
    const valueCount = value?.length ?? 0

    // An absent repeater begins with one empty UI row. Add can create one empty
    // row after existing values. Neither enters the model until first update.
    const hasEmptyRow =
      valueCount < max &&
      (emptyRowState.get(repeater.name) === "added" ||
        (value === undefined && emptyRowState.get(repeater.name) !== "removed"))
    const rowCount = valueCount + (hasEmptyRow ? 1 : 0)
    const keys = syncRowKeys(repeater.name, rowCount)

    const rows: ResolvedRepeaterRow[] = keys.map((key, index) => {
      const isEmptyRow = hasEmptyRow && index === valueCount

      if (repeater.field !== undefined) {
        const name = `${repeater.name}.${index}`
        const input = {
          ...repeater.field,
          name,
          label: addIndex(repeater.field.label, index, repeater.indexPosition),
          ...(repeater.disabled ? { disabled: true } : {}),
        } as FieldsSchemaInput

        return {
          key,
          type: "field",
          fields: [
            {
              key: "field",
              input: resolveInput(input, ($val) => {
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
          const input = {
            ...field,
            name,
            ...(repeater.disabled ? { disabled: true } : {}),
          } as FieldsSchemaInput

          return {
            key: field.name,
            input: resolveInput(input, ($val) => {
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
        type: repeater.field !== undefined ? "field" : "collection",
        title: repeater.title,
        help: repeater.help,
        count: valueCount,
        min: repeater.min,
        max: repeater.max,
        rows,
        addButtonText: repeater.addButtonText ?? "Add",
        addDisabled:
          Boolean(repeater.disabled) || hasEmptyRow || rowCount >= max,
        removeDisabled: Boolean(repeater.disabled) || rowCount <= min,
        onAdd: () => addItem(repeater, rowCount, hasEmptyRow, max),
        onRemove: (index: number) =>
          removeItem(repeater, rowCount, min, index, value, hasEmptyRow),
      },
      show: typeof repeater.show === "boolean" ? repeater.show : true,
    }
  }

  return { resolveRepeater }
}
