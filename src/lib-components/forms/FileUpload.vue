<script setup lang="ts">
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUpTrayIcon,
  DocumentIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/vue/outline"
import { computed, onBeforeUnmount, ref, useTemplateRef, watch } from "vue"
import BaseAPI from "@/api/base"
import type { TrailsResp } from "@/api/client"
import {
  defaultInputProps,
  defaultModelOpts,
  type FileUploadInput,
  type UploadedFile,
  useInputField,
} from "@/composables/forms"
import bytes from "@/helpers/Bytes"
import InputError from "./InputError.vue"
import InputHelp from "./InputHelp.vue"
import InputLabel from "./InputLabel.vue"

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FileUploadInput>(), {
  ...defaultInputProps,
  accept: () => [],
  fileField: "file",
  multiple: false,
})

const modelState = defineModel<FileUploadInput["modelValue"]>(defaultModelOpts)
const { aria, errorState, inputID, isDisabled, isRequired } =
  useInputField(props)

// Rejected files failed local validation. Failed files reached the server and
// can be retried without asking the user to select them again.
type Status = "rejected" | "queued" | "uploading" | "failed"

interface Upload {
  error: string
  file: File
  key: number
  status: Status
}

// Uploaded and local files share the same list item layout,
// but have unique fields.
type Item =
  | {
      key: string
      kind: "uploaded"
      file: UploadedFile
      index: number
    }
  | { key: string; kind: "pending"; upload: Upload }

const inputRef = useTemplateRef<HTMLInputElement>("input")
const validationRef = useTemplateRef<HTMLInputElement>("validation")

// Keep local files until an upload succeeds so failed requests can be retried.
const pending = ref<Upload[]>([])

let nextKey = 0
let isProcessing = false

// NOTE(spk): Full-page navigation tears down the request, but conditional
// fields and repeater items can unmount during an upload. We do not cancel
// in-flight requests, so ignore their results after teardown.
let isUnmounted = false

// Normalize both model modes to an array for shared rendering and operations.
const uploaded = computed<UploadedFile[]>(() => {
  const value = modelState.value

  if (props.multiple) {
    return Array.isArray(value) ? value : []
  }

  return value && !Array.isArray(value) ? [value] : []
})

const counts = computed(() => {
  const totals = {
    queued: 0,
    uploading: 0,
    errors: 0,
  }

  for (const upload of pending.value) {
    if (upload.status === "queued" || upload.status === "uploading") {
      totals[upload.status] += 1
    } else {
      totals.errors += 1
    }
  }

  return totals
})

const hasActive = computed(
  () => counts.value.queued > 0 || counts.value.uploading > 0
)

const items = computed<Item[]>(() => [
  ...uploaded.value.map(
    (file, index): Item => ({
      key: `uploaded-${file.id}-${index}`,
      kind: "uploaded",
      file,
      index,
    })
  ),
  ...pending.value.map(
    (upload): Item => ({
      key: `pending-${upload.key}`,
      kind: "pending",
      upload,
    })
  ),
])

const isPickerDisabled = computed(
  () => isDisabled.value || (!props.multiple && hasActive.value)
)

const pickerLabel = computed(() => {
  if (props.multiple) {
    return items.value.length ? "Add files" : "Choose files"
  }

  return uploaded.value.length ? "Change file" : "Choose file"
})

const instructions = computed(() => {
  const values: string[] = []

  if (props.accept.length > 0) {
    values.push(`Accepted: ${props.accept.join(", ")}`)
  }

  if (props.maxFileBytes !== undefined) {
    values.push(`Maximum per file: ${bytes.format(props.maxFileBytes)}`)
  }

  if (props.multiple && props.maxFiles !== undefined) {
    values.push(`Maximum files: ${props.maxFiles}`)
  }

  return values.join(" · ")
})

const describedBy = computed(
  () =>
    [
      aria.value.describedby,
      instructions.value ? `${inputID.value}-instructions` : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined
)

// Validation errors are ordered by what the user must resolve first.
const validationError = computed(() => {
  if (isDisabled.value) {
    return ""
  }

  if (hasActive.value) {
    return "Please wait for the selected files to finish uploading."
  }

  if (counts.value.errors > 0) {
    return "Remove invalid files or retry failed uploads before continuing."
  }

  if (isRequired.value && uploaded.value.length === 0) {
    return props.multiple
      ? "Please upload at least one file."
      : "Please upload a file."
  }

  return ""
})

// The native accept attribute only filters the picker. Apply the same rules
// before uploading so extensions, MIME types, and MIME wildcards are enforced.
const isAccepted = (file: File): boolean => {
  if (props.accept.length === 0) {
    return true
  }

  const filename = file.name.toLowerCase()
  const contentType = file.type.toLowerCase()

  return props.accept.some((untrimmedRule) => {
    const rule = untrimmedRule.trim().toLowerCase()
    if (rule === "") {
      return false
    }
    if (rule.startsWith(".")) {
      return filename.endsWith(rule)
    }
    if (rule.endsWith("/*")) {
      return contentType.startsWith(rule.slice(0, -1))
    }
    return contentType === rule
  })
}

const getFileError = (file: File, fileCount: number): string => {
  if (!isAccepted(file)) {
    return "This file type is not accepted."
  }

  if (props.maxFileBytes !== undefined && file.size > props.maxFileBytes) {
    return `This file exceeds the ${bytes.format(
      props.maxFileBytes
    )} per-file limit.`
  }

  const limit = props.multiple ? props.maxFiles : 1
  if (limit !== undefined && fileCount >= limit) {
    return `No more than ${limit} file${
      limit === 1 ? "" : "s"
    } may be uploaded.`
  }

  return ""
}

// Update the model only after a request succeeds so a single-file replacement
// keeps the previous file while the new file uploads.
const addUploaded = (file: UploadedFile) => {
  if (props.multiple) {
    modelState.value = [...uploaded.value, file]
  } else {
    modelState.value = file
  }
}

// Keep uploads sequential within this component.
const processQueue = async () => {
  if (isProcessing || isUnmounted || isDisabled.value) {
    return
  }

  isProcessing = true

  try {
    while (!isUnmounted && !isDisabled.value) {
      const upload = pending.value.find(
        (candidate) => candidate.status === "queued"
      )
      if (!upload) {
        break
      }

      upload.status = "uploading"
      upload.error = ""

      const form = new FormData()
      form.append(props.fileField, upload.file)

      try {
        const response = await BaseAPI.post<TrailsResp<UploadedFile>>(
          props.action,
          form,
          { skipLoader: true }
        )

        if (isUnmounted) {
          return
        }

        addUploaded(response.data)
        pending.value = pending.value.filter(
          (candidate) => candidate.key !== upload.key
        )
      } catch {
        if (isUnmounted) {
          return
        }

        upload.status = "failed"
        upload.error = "This file could not be uploaded."
      }
    }
  } finally {
    isProcessing = false
  }
}

const openPicker = () => {
  inputRef.value?.click()
}

const onSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files ? Array.from(input.files) : []

  // Clear the value so selecting the same file triggers another change event.
  input.value = ""

  if (files.length === 0 || isDisabled.value) {
    return
  }

  if (!props.multiple) {
    // Replace a failed selection when another single file is selected.
    pending.value = []
  }

  // Locally rejected files do not consume a slot; retryable failures do.
  let fileCount = props.multiple
    ? uploaded.value.length +
      pending.value.filter((upload) => upload.status !== "rejected").length
    : 0

  const additions: Upload[] = []
  for (const file of files) {
    const error = getFileError(file, fileCount)
    nextKey += 1

    additions.push({
      error,
      file,
      key: nextKey,
      status: error === "" ? "queued" : "rejected",
    })

    if (error === "") {
      fileCount += 1
    }
  }

  pending.value = [...pending.value, ...additions]
  processQueue()
}

const retry = (upload: Upload) => {
  upload.error = ""
  upload.status = "queued"

  processQueue()
}

const removePending = (upload: Upload) => {
  pending.value = pending.value.filter((p) => p.key !== upload.key)
}

const removeUploaded = (index: number) => {
  if (props.multiple) {
    modelState.value = uploaded.value.filter(
      (_candidate, candidateIndex) => candidateIndex !== index
    )
  } else {
    modelState.value = null
  }
}

const onInvalid = () => {
  errorState.value = validationError.value
  validationRef.value?.setCustomValidity(validationError.value)
}

// Keep native validation and the visible error in sync as queue state changes.
watch(validationError, (message) => {
  validationRef.value?.setCustomValidity(message)

  if (!message) {
    errorState.value = ""
  } else if (errorState.value) {
    errorState.value = message
  }
})

// Let the active request finish when disabled, then resume the queue when the
// input is enabled again.
watch(isDisabled, (disabled) => {
  if (!disabled) {
    processQueue()
  }
})

onBeforeUnmount(() => {
  isUnmounted = true
})
</script>

<template>
  <div class="relative">
    <InputLabel
      :id="aria.labelledby"
      class="mb-1"
      :for="`${inputID}-picker`"
      :label="label"
      :required="isRequired"
    />
    <InputHelp :id="aria.describedby" class="mb-3" :text="help" />

    <ul
      v-if="items.length"
      class="space-y-3"
      :aria-labelledby="aria.labelledby"
    >
      <li v-for="item in items" :key="item.key" class="flex items-center gap-3">
        <div
          :class="[
            'grid min-w-0 flex-1 grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-md border px-3 py-2 shadow-sm sm:flex',
            item.kind === 'pending' &&
            (item.upload.status === 'rejected' ||
              item.upload.status === 'failed')
              ? 'border-red-700'
              : 'border-gray-300',
            isDisabled ? 'bg-gray-50' : 'bg-white',
          ]"
        >
          <ArrowPathIcon
            v-if="item.kind === 'pending' && item.upload.status === 'uploading'"
            class="h-5 w-5 shrink-0 animate-spin text-xy-blue motion-reduce:animate-none"
            aria-hidden="true"
          />

          <DocumentIcon
            v-else
            class="h-5 w-5 shrink-0 text-gray-500"
            aria-hidden="true"
          />

          <div class="min-w-0 flex-1">
            <template v-if="item.kind === 'uploaded'">
              <span class="text-sm text-gray-800 [overflow-wrap:anywhere]">
                {{ item.file.name }}
              </span>
              <p class="mt-0.5 text-xs text-gray-600">Uploaded</p>
            </template>

            <template v-else>
              <p class="text-sm text-gray-800 [overflow-wrap:anywhere]">
                {{ item.upload.file.name }}
              </p>
              <p
                v-if="item.upload.status === 'queued'"
                class="mt-0.5 text-xs text-gray-600"
              >
                Waiting to upload
              </p>
              <p
                v-else-if="item.upload.status === 'uploading'"
                class="mt-0.5 text-xs text-gray-600"
              >
                Uploading&hellip;
              </p>
              <p v-else class="mt-0.5 text-xs text-red-700">
                {{ item.upload.error }}
              </p>
            </template>
          </div>

          <a
            v-if="item.kind === 'uploaded' && item.file.url"
            class="xy-btn-neutral-sm"
            :href="item.file.url"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`Open ${item.file.name} in a new window`"
          >
            <ArrowTopRightOnSquareIcon class="h-5 w-5" aria-hidden="true" />
          </a>

          <button
            v-if="item.kind === 'pending' && item.upload.status === 'failed'"
            type="button"
            class="xy-btn-neutral-sm col-start-2 shrink-0 justify-self-start"
            :disabled="isDisabled"
            :aria-label="`Retry ${item.upload.file.name}`"
            @click="retry(item.upload)"
          >
            Retry
          </button>
        </div>

        <button
          type="button"
          class="xy-btn-neutral-sm shrink-0"
          :disabled="
            isDisabled ||
            (item.kind === 'pending' && item.upload.status === 'uploading')
          "
          :aria-label="`Remove ${
            item.kind === 'uploaded' ? item.file.name : item.upload.file.name
          }`"
          @click="
            item.kind === 'uploaded'
              ? removeUploaded(item.index)
              : removePending(item.upload)
          "
        >
          <TrashIcon class="h-4 w-4" aria-hidden="true" />
        </button>
      </li>
    </ul>

    <div
      :class="[
        'flex flex-wrap items-center gap-3',
        items.length ? 'mt-3' : 'rounded-md border px-3 py-2 shadow-sm',
        !items.length
          ? errorState
            ? 'border-red-700'
            : 'border-gray-300'
          : '',
        !items.length ? (isDisabled ? 'bg-gray-50' : 'bg-white') : '',
      ]"
    >
      <template v-if="!items.length">
        <DocumentIcon
          class="h-5 w-5 shrink-0 text-gray-500"
          aria-hidden="true"
        />
        <span class="min-w-0 flex-1 text-sm text-gray-500">
          {{
            placeholder || (multiple ? "No files uploaded" : "No file uploaded")
          }}
        </span>
      </template>

      <button
        :id="`${inputID}-picker`"
        type="button"
        :class="[
          'xy-btn-neutral-sm shrink-0 gap-x-1.5',
          !items.length ? 'bg-white ring-1 ring-gray-300 ring-inset' : '',
        ]"
        :disabled="isPickerDisabled"
        :aria-label="`${pickerLabel}: ${label || 'file upload'}`"
        :aria-describedby="describedBy"
        :aria-errormessage="aria.errormessage"
        :aria-invalid="errorState ? true : undefined"
        @click="openPicker"
      >
        <PlusIcon
          v-if="multiple && items.length"
          class="h-4 w-4"
          aria-hidden="true"
        />
        <ArrowUpTrayIcon v-else class="h-4 w-4" aria-hidden="true" />
        {{ pickerLabel }}
      </button>
    </div>

    <p
      v-if="instructions"
      :id="`${inputID}-instructions`"
      class="mt-2 text-xs text-gray-600"
    >
      {{ instructions }}
    </p>

    <InputError :id="aria.errormessage" class="mt-1" :text="errorState" />

    <input
      :id="inputID"
      ref="input"
      class="sr-only"
      type="file"
      tabindex="-1"
      :accept="accept.length ? accept.join(',') : undefined"
      :aria-labelledby="aria.labelledby"
      :aria-describedby="describedBy"
      :aria-errormessage="aria.errormessage"
      :disabled="isPickerDisabled"
      :multiple="multiple"
      @change="onSelect"
    />

    <!-- Native form validation support. -->
    <input
      v-if="validationError"
      ref="validation"
      required
      class="sr-only top-1 left-1"
      type="checkbox"
      aria-hidden="true"
      :tabindex="errorState ? undefined : -1"
      @invalid="onInvalid"
    />
  </div>
</template>
