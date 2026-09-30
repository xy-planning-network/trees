<script setup lang="ts">
import { ref } from "vue"
import { bytes } from "@/entry"
import {
  FileUploadValue,
  InputOption,
  NumericInputType,
  TextInputType,
  numericInputTypes,
  textInputTypes,
} from "@/composables/forms"
import { dateRangeActions } from "@/composables/dateRange"
import type { FieldsSchema } from "@/composables/useFieldsSchema"
import Slideover from "@/lib-components/overlays/Slideover.vue"
import { fileUploadMockAction } from "../mocks/fileUpload"

const options: InputOption[] = [
  {
    label: "You could select this",
    help: "It's really quite nice.",
    value: "One",
    disabled: false,
  },
  {
    label: "This is an option",
    help: "Ah, indeed it is an option.",
    value: "Two",
  },
  {
    label: "Feeling good about this one?",
    help: "Of course you are!",
    value: 3,
  },
  {
    disabled: true,
    label: "This is the LAST option",
    help: "There's no turning back.",
    value: 4,
  },
]

// test generic options and sublabel slot availability
const radioCardOptions = options.map((opt) => {
  return {
    ...opt,
    sublabel: typeof opt.value === "string" ? opt.value : `$${opt.value}.00`,
    onSale: typeof opt.value === "string" ? false : true,
  }
})

const inputTypes: InputOption[] = textInputTypes.map((type) => {
  return {
    label: type,
    value: type,
  }
})

const numericInputOpts: InputOption[] = numericInputTypes.map((type) => {
  return {
    label: type,
    value: type,
  }
})

/**
 * v-models
 */
const inputTypeSelected = ref<TextInputType>("text")
const numericTypeSelected = ref<NumericInputType>("number")
const inputVals = ref<Record<string, any>>({})
const toggleValue = ref(undefined)
const dateRangeInput = ref({ minDate: 1725148800, maxDate: 1727740799 })
const dateTimeInput = ref<string>("2015-08-01T15:30:00.000Z")
const validationUpload = ref<FileUploadValue>(null)
const existingUpload = ref<FileUploadValue>({
  id: 123,
  filename: "engagement-letter.pdf",
  url: "https://example.com/engagement-letter.pdf",
})
const fileUploadValues = ref<Record<string, any>>({
  documents: [
    {
      id: 456,
      filename: "compliance-review.docx",
      url: "https://example.com/compliance-review.docx",
    },
    {
      id: 789,
      filename: "supporting-data.xlsx",
    },
  ],
})
/**
 * Copy Help
 */
const checkboxCopy = `<Checkbox label="I'm here to party!" help="Get notified when the party starts." v-model="checked" />`
const dateRangePickerCopy = `<DateRangePicker v-model="dateRange" />`
const dateTimeCopy = `<DateTime v-model="dateTime" label="Select a date and time" help="Use your local timezone!" />`
const inputCopy = `<BaseInput type="text" label="What's your lide moto?" help="No wrong ansswers here." placeholder="It's good to be alive" />`
const multiCheckboxCopy = `<MultiCheckboxes v-model="selected" label="Make Some Selections" help="Select all that apply." :options="options" />`
const numberCopy = `<NumberInput label="Give me a number" help="I'll format it for you." />`
const radioCopy = `<Radio :options="options" v-model="selected" />`
const selectCopy = `<Select :options="options" placeholder="Select an option that you fancy" />`
const yesOrNoRadioCopy = `<YesOrNoRadio v-model="selected" />`
const textareaCopy = `<TextArea v-model="textarea" />`
const inputLabelCopy = `<InputLabel label="I'm labeling something..." />`
const toggleCopy = `<Toggle v-model="toggleValue"></Toggle>`
const inputHelpCopy = `<InputHelp text="I'm just here to hint." />`
const fileUploadCopy = `<FileUpload
  v-model="documents"
  action="raw-data-uploads?kind=document"
  :accept="['.docx', '.pdf']"
  :max-file-bytes="bytes.megabytes(5)"
  multiple
  required
/>`
const fileUploadRepeaterCopy = `{
  type: "repeater",
  name: "documents",
  field: {
    type: "file-upload",
    action: "raw-data-uploads?kind=document",
    accept: [".docx", ".pdf"],
    required: true
  }
}`

/**
 * Props
 */
const inputLabelProps = [
  { name: "label", required: false, type: "string" },
  { name: "required", required: false, type: "boolean" },
  { name: "tag", required: false, type: "string" },
]

const inputHelpProps = [
  { name: "text", required: false, type: "string" },
  { name: "tag", required: false, type: "string" },
]

const inputErrorProps = [{ name: "text", required: false, type: "string" }]

const inputCommonProps = [
  { name: "label", required: false, type: "string" },
  { name: "help", required: false, type: "string" },
  { name: "placeholder", required: false, type: "string" },
]

const inputOptionsProp = {
  name: "options",
  required: true,
  type: `{
    disabled?: boolean
    help?: string
    label: string
    sublabel?: string
    value: string | number
  }[]`,
}

const booleanInputProps = [
  { name: "modelValue", required: false, type: "boolean | null" },
  ...inputCommonProps,
]

const dateRangeInputProps = [
  {
    name: "actions",
    required: false,
    type: `DateRangeAction[]`,
  },
  {
    name: "modelValue",
    required: false,
    type: `{minDate: number, maxDate: number}`,
  },
  { name: "maxRange", required: false, type: "number" },
  { name: "maxValue", required: false, type: "Date | null" },
  { name: "minValue", required: false, type: "Date" },
  {
    name: "position",
    required: false,
    type: "'bottom' | 'bottom-start' | 'bottom-end'",
  },
  ...inputCommonProps,
]

const dateTimeInputProps = [
  {
    name: "modelValue",
    required: false,
    type: `string`,
  },
  ...inputCommonProps,
]

const numericInputProps = [
  { name: "type", required: false, type: numericInputTypes.join(" | ") },
  { name: "modelValue", required: false, type: "number | null" },
  ...inputCommonProps,
]

const textLikeInputProps = [
  { name: "type", required: true, type: textInputTypes.join(" | ") },
  { name: "modelValue", required: false, type: "string | number | null" },
  ...inputCommonProps,
]

const textareaInputProps = [
  { name: "modelValue", required: false, type: "string | number | null" },
  ...inputCommonProps,
]

const optionsInputProps = [
  inputOptionsProp,
  { name: "modelValue", required: false, type: "string | number | null" },
  ...inputCommonProps,
]

const multichoiceInputProps = [
  inputOptionsProp,
  { name: "modelValue", required: false, type: "(string | number)[] | null" },
  ...inputCommonProps,
]

const fileUploadInputProps = [
  { name: "action", required: true, type: "string" },
  { name: "accept", required: false, type: "string[]" },
  { name: "multiple", required: false, type: "boolean" },
  { name: "fileField", required: false, type: "string" },
  { name: "maxFileBytes", required: false, type: "number" },
  { name: "maxFiles", required: false, type: "number" },
  {
    name: "modelValue",
    required: false,
    type: "UploadedFile | UploadedFile[] | null",
  },
  { name: "label", required: false, type: "string" },
  { name: "help", required: false, type: "string" },
]

const toggleProps = [
  { name: "modelValue", required: false, type: "boolean" },
  { name: "label", required: false, type: "string" },
  { name: "help", required: false, type: "string" },
]

const slideoverOpen = ref(false)

const contactRoleOptions: InputOption[] = [
  { label: "Account owner", value: "Account owner" },
  { label: "Billing", value: "Billing" },
  { label: "Operations", value: "Operations" },
]

const contactServiceOptions: InputOption[] = [
  { label: "Financial planning", value: "planning" },
  { label: "Tax planning", value: "tax" },
  { label: "Investment management", value: "investments" },
]

const repeaterValues = ref<Record<string, any>>({
  notification_emails: ["operations@example.com", "billing@example.com"],
  contacts: [
    {
      name: "Jamie Example",
      role: "Account owner",
      email: "jamie@example.com",
      primary: true,
      services: ["planning", "investments"],
    },
    {
      name: "Taylor Sample",
      role: "Billing",
      email: "taylor@example.com",
      primary: false,
      services: ["tax"],
    },
  ],
})
const repeaterSchema: FieldsSchema = [
  {
    title: "Contact information",
    description: "Manage notification emails and team contacts.",
    fields: [
      {
        type: "repeater",
        name: "notification_emails",
        title: "Notification emails",
        help: "Send updates to these addresses.",
        addText: "Add email address",
        max: 3,
        field: {
          type: "email",
          required: true,
        },
      },
      {
        type: "repeater",
        name: "phone_numbers",
        title: "Phone numbers",
        help: "Add any phone numbers associated with this team.",
        indexPosition: "suffix",
        addText: "Add phone number",
        min: 1,
        max: 3,
        field: {
          type: "tel",
          label: "Phone number",
          placeholder: "(555) 555-5555",
          required: true,
        },
      },
      {
        type: "repeater",
        name: "contacts",
        title: "Team contacts",
        itemTitle: "Contact",
        help: "Add contact details and assign the services they support.",
        indexPosition: "prefix",
        addText: "Add contact",
        min: 1,
        max: 2,
        fields: [
          {
            type: "text",
            name: "name",
            label: "Full name",
            span: "xl",
          },
          {
            type: "select",
            name: "role",
            label: "Role",
            options: contactRoleOptions,
            span: "xl",
          },
          {
            type: "email",
            name: "email",
            label: "Email address",
            span: "2xl",
            start: true,
          },
          {
            type: "yes-no-radio",
            name: "primary",
            label: "Primary contact",
            span: "md",
          },
          {
            type: "multi-select",
            name: "services",
            label: "Services",
            help: "Select all that apply.",
            options: contactServiceOptions,
            span: "full",
          },
        ],
      },
    ],
  },
]

const fileUploadSchema: FieldsSchema = [
  {
    type: "file-upload",
    name: "documents",
    action: fileUploadMockAction,
    label: "Supporting documents",
    help: 'Try an upload here. Add "error" to the filename to see it fail once, then retry it.',
    accept: [".docx", ".pdf", ".xlsx", ".png"],
    maxFileBytes: bytes.megabytes(5),
    maxFiles: 4,
    multiple: true,
  },
]
</script>

<template>
  <div class="docs-page-wrapper">
    <ComponentLayout title="Input HTML Attributes" :show-badge="false">
      <template #description>
        <div class="mt-4">
          Generally, all of these inputs will support common html attributes
          such as <code>disabled</code> and <code>required</code> or input
          specific attributes like <code>rows</code> for textareas.
        </div>

        <div class="mt-4">
          Out of the box they will support a dynamically generated id attribute
          which is used for accessibility concerns with labels and help text.
        </div>
      </template>
    </ComponentLayout>

    <ComponentLayout title="Base Input">
      <template #description>
        Covers many of the most common <code>&lt;input&gt;</code> fields with a
        <code>type="${type}"</code> attribute. Checkout the list of common
        <a
          href="https://developer.mozilla.org/en-US/docs/Learn/Forms/HTML5_input_types"
          class="xy-link"
          target="_blank"
          >input variations</a
        >. When the type attribute is set to 'number' the value returned will be
        a number making v-model.number modifiers unnecessary - (type 'number' is
        Deprecated, use 'NumberInput' instead). Likewise, the `trim()` method is
        applies to all string values making the v-model.trim modifier
        unnecessary.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="inputCopy" />
        </label>
        <div class="mt-1">
          <BaseInput
            help="No wrong answers here."
            type="text"
            label="What's your life moto?*"
            placeholder="It's good to be alive"
          />
        </div>
      </div>

      <div>
        <div class="mt-1 space-y-3">
          <BaseInput
            :disabled="true"
            type="text"
            label="Disabled without placeholder"
          />

          <BaseInput
            :disabled="true"
            type="text"
            label="Disabled with placeholder"
            placeholder="A disabled input"
          />

          <BaseInput
            model-value="A disabled input with a value"
            :disabled="true"
            type="text"
            label="Disabled with value"
          />
        </div>
      </div>

      <div>
        <div class="border-t pt-4 mt-4">
          <Select
            v-model="inputTypeSelected"
            :options="inputTypes"
            label="Try out some common input types"
            placeholder="Select an input type"
            class="mb-8"
          />
          <BaseInput
            v-model="inputVals[`baseInput-${inputTypeSelected}`]"
            :help="`Some help text for a ${inputTypeSelected}`"
            :type="inputTypeSelected"
            :label="`Here's an example of an <input type='${inputTypeSelected}'>`"
            :placeholder="`A placeholder for a ${inputTypeSelected}`"
            @update:model-value="
              $log(
                `v-model update event for BaseInput type='${inputTypeSelected}': ${$event}`
              )
            "
          />

          <div class="mt-4">
            <p>
              <b>Value:</b> {{ inputVals[`baseInput-${inputTypeSelected}`] }}
            </p>
            <p>
              <b>Type:</b>
              {{ typeof inputVals[`baseInput-${inputTypeSelected}`] }}
            </p>
          </div>

          <PropsTable :props="textLikeInputProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Number Input">
      <template #description
        >The HTML input type="number" doesn't format numbers and can be
        difficult to read. Grab this number input to provide a well formatted
        input or capture monetary inputs as U.S. cents with the money
        type.</template
      >

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="numberCopy" />
        </label>
        <div class="mt-1">
          <Select
            v-model="numericTypeSelected"
            :options="numericInputOpts"
            label="Try out the numeric types"
            placeholder="Select a numeric type"
            class="mb-8"
          />
          <NumberInput
            v-model="inputVals[`numericInput-${numericTypeSelected}`]"
            :help="`Some help text for a ${numericTypeSelected}`"
            :type="numericTypeSelected"
            :label="`Here's an example of an <input type='${numericTypeSelected}'>`"
            :placeholder="`A placeholder for a ${numericTypeSelected}`"
            :precision="1"
            @update:model-value="
              $log(
                `v-model update event for NumberInput type='${numericTypeSelected}': ${$event}`
              )
            "
          />

          <div class="mt-4">
            <p>
              <b>Value:</b>
              {{ inputVals[`numericInput-${numericTypeSelected}`] }}
            </p>
            <p>
              <b>Type:</b>
              {{ typeof inputVals[`numericInput-${numericTypeSelected}`] }}
            </p>
          </div>

          <PropsTable :props="numericInputProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Textarea">
      <template #description>
        A common and consistent textarea input. Return values are automatically
        trimed with the `trim()` method and the v-model.trim modifier is
        unnecessary.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="textareaCopy" />
        </label>
        <div class="mt-1">
          <TextArea
            v-model="inputVals['textarea']"
            label="How about it?"
            help="In your own words."
            placeholder="Don't be shy now..."
            :rows="8"
            @update:model-value="
              $log(`v-model update event for TextArea: ${$event}`)
            "
          />

          <div class="mt-4">
            <TextArea
              v-model="inputVals['textarea']"
              :disabled="true"
              label="How about it (disabled)?"
              help="In your own words."
            />
          </div>

          <div class="mt-4"><b>Value:</b> {{ inputVals["textarea"] }}</div>
          <PropsTable :props="textareaInputProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Checkbox">
      <template #description>
        Checkboxes are a wrapped component given that they have a complex
        structure.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="checkboxCopy" />
        </label>
        <div class="mt-1 space-y-8">
          <Checkbox
            v-model="inputVals['checkbox']"
            label="I'm here to party!"
            help="Get notified when the party starts."
            @update:model-value="
              $log(`v-model update event for Checkbox: ${$event}`)
            "
          />

          <Checkbox
            v-model="inputVals['checkbox']"
            :disabled="true"
            label="I'm here to party! (disabled)"
            help="Get notified when the party starts."
          />

          <Checkbox
            v-model="inputVals['checkbox']"
            label="I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party!"
          />

          <div class="mt-4"><b>Value:</b> {{ inputVals["checkbox"] }}</div>
          <PropsTable :props="booleanInputProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout id="date-picker" title="Date Range Picker">
      <template #description>
        We are using
        <a
          href="https://www.reka-ui.com/examples/date-picker-selection"
          class="xy-link"
          target="_blank"
          >Reka-UI</a
        >
        to select date ranges.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="dateRangePickerCopy" />
        </label>
        <div class="mt-1">
          <DateRangePicker
            v-model="inputVals['dateRangePicker']"
            :actions="dateRangeActions"
            :max-range="365"
            required
            @update:model-value="
              $log(`v-model update event for DateRangePicker:`, $event)
            "
          />

          <div class="mt-4">
            <b>Value:</b> {{ inputVals["dateRangePicker"] }}
          </div>

          <div class="mt-4">
            <DateRangePicker
              v-model="dateRangeInput"
              disabled
              label="Hydrated Range"
              help="Initialized with { minDate: 1725148800, maxDate: 1727740799 }"
            />
          </div>

          <div class="mt-4">
            <h5 class="mb-2">Date Range Picker Inside A Dialog</h5>
            <button class="xy-btn-sm" @click="slideoverOpen = !slideoverOpen">
              Open Slideover
            </button>

            <Slideover
              v-model="slideoverOpen"
              header="Forms"
              description="Ensure this element is accessible inside a slideover."
            >
              <DateRangePicker
                v-model="inputVals['dateRangePicker']"
                label="Select a Date Range"
              />
            </Slideover>
          </div>
          <PropsTable :props="dateRangeInputProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Date Time Input">
      <template #description>
        The DateTime input wraps the HTML datetime-local type input and handles
        the v-model mutations necessary to adhere to the RFC 3339 date format.
        Like BaseInput, this component will forward attributes like disabled,
        max, min, required, and step.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="dateTimeCopy" />
        </label>
        <div class="mt-1">
          <DateTime
            v-model="inputVals['dateTimeLocal']"
            required
            @update:model-value="
              $log(`v-model update event for DateTime: ${$event}`)
            "
          />

          <div class="mt-4"><b>Value:</b> {{ inputVals["dateTimeLocal"] }}</div>

          <div class="mt-4">
            <DateTime
              v-model="dateTimeInput"
              label="Was this adjusted to your browsers timezone?"
              help="Initialized with 2015-08-01T15:30:00.000Z"
              disabled
            />
          </div>
          <PropsTable :props="dateTimeInputProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Multi Checkboxes">
      <template #description>
        This can be used to select an array of values.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="multiCheckboxCopy" />
        </label>
        <div class="mt-1 space-y-8">
          <MultiCheckboxes
            v-model="inputVals['multiCheckboxes']"
            label="Make Basic Selections"
            :options="
              options.map((option) => ({
                disabled: option.disabled,
                label: option.label,
                value: option.value,
              }))
            "
            required
            @update:model-value="
              $log(`v-model update event for MultiCheckboxes: ${$event}`)
            "
          />

          <MultiCheckboxes
            v-model="inputVals['multiCheckboxes']"
            label="Make Complex Selections"
            help="Select all that apply."
            :options="options"
            disabled
          />

          <MultiCheckboxes
            v-model="inputVals['multiCheckboxes']"
            label="Lay it out in a grid"
            :columns="2"
            help="Set the columns prop to 2 or 3"
            :options="options"
          >
            <template #legend>In A Grid Too</template>
          </MultiCheckboxes>

          <div class="mt-2">
            <b>Value:</b> {{ inputVals["multiCheckboxes"] }}
          </div>

          <PropsTable :props="multichoiceInputProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Radio">
      <template #description>
        Similar to checkboxes, these are wrapped in a vue component given their
        nested structure so that we are consistent across all projects.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="radioCopy" />
        </label>
        <div class="mt-1 space-y-8">
          <Radio
            v-model="inputVals['radio']"
            label="Make Basic Choice"
            :options="
              options.map((option) => ({
                disabled: option.disabled,
                label: option.label,
                value: option.value,
              }))
            "
            @update:model-value="
              $log(`v-model update event for Radio: ${$event}`)
            "
          />

          <Radio
            v-model="inputVals['radio']"
            label="Make Complex Choice"
            help="Only one - I know it's hard!"
            :options="options"
            disabled
          />

          <Radio
            v-model="inputVals['radio']"
            label="Lay it out in a grid"
            help="Set the columns prop to 2 or 3"
            :options="options"
            :columns="2"
            required
          />

          <div class="">
            <form>
              <RadioCards
                v-model="inputVals['radio']"
                label="Cards Any One?"
                help="Just use the RadioCards component."
                :options="radioCardOptions"
                :columns="2"
                required
              />
              <input type="hidden" name="page" value="Forms" />
              <input class="xy-btn mt-2" type="submit" value="submit" />
            </form>
          </div>

          <div class="">
            <RadioCards
              v-model="inputVals['radio']"
              :disabled="true"
              label="Need a complex sublabel on your cards?"
              help="The sublabel display is supported by both options.sublabel and a named slot #sublabel."
              :options="radioCardOptions"
              :columns="2"
              @update:model-value="
                $log(`v-model update event for RadioCards: ${$event}`)
              "
            >
              <template #sublabel="{ option }">
                {{ option.sublabel }}
                <span v-if="option.onSale" class="text-green-700">
                  On Sale!
                </span>
              </template>
            </RadioCards>
          </div>

          <div class="prose mt-4">
            <p>
              The <code>sublabel</code> slot receives the following scoped slot
              props:
            </p>
            <ul>
              <li>active: boolean</li>
              <li>checked: boolean</li>
              <li>disabled: boolean</li>
              <li>
                option:
                <code
                  >{disabled: boolean, help: string, label: string, sublabel:
                  string, value: string | number, ... }</code
                >
              </li>
            </ul>
          </div>

          <div class="mt-4">
            <b>Value:</b> {{ inputVals["radio"] }} -
            {{ typeof inputVals["radio"] }}
          </div>
          <PropsTable :props="optionsInputProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Select">
      <template #description>
        Similar to checkboxes, these are wrapped in a vue component given their
        nested structure so that we are consistent across all projects.
        <br /><br />When the options set use number types as their values, the
        return value of the input will also be a number making v-model.number
        usage unnecessary. <br /><br />As a best practice avoid mixing string
        and number type values in the options and note that mixed types that
        resolve to the same string value, ex: '3' and 3 are not supported.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="selectCopy" />
        </label>
        <div class="space-y-6">
          <Select
            v-model="inputVals['select']"
            :options="options"
            label="Lets make a selection"
            @update:model-value="
              $log(`v-model update event for Select: ${$event}`)
            "
          />

          <Select
            v-model="inputVals['select']"
            :options="options"
            label="Lets make a selection"
            help="Disabled select input"
            disabled
          />
        </div>

        <div class="mt-4">
          <b>Value:</b> {{ inputVals["select"] }} -
          {{ typeof inputVals["select"] }}
        </div>
        <PropsTable :props="optionsInputProps" />
      </div>
    </ComponentLayout>

    <ComponentLayout title="Yes or No Radio">
      <template #description>
        This is a "yes" or "no" UI form input that maps to a boolean. You could
        even use it in a truth or dare app. Whoa.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="yesOrNoRadioCopy" />
        </label>
        <div class="mt-1">
          <YesOrNoRadio
            v-model="inputVals['yesOrNoRadio']"
            label="Is this thing on?"
            help="Only one way to find out."
            @update:model-value="
              $log(`v-model update event for YesOrNoRadio: ${$event}`)
            "
          ></YesOrNoRadio>
          <div class="mt-2">
            <YesOrNoRadio
              v-model="inputVals['yesOrNoRadio']"
              label="Is this thing on? (disabled)"
              disabled
            ></YesOrNoRadio>
          </div>
          <div class="mt-4">
            <b>Value:</b> {{ inputVals["yesOrNoRadio"] }} -
            {{ typeof inputVals["yesOrNoRadio"] }}
          </div>
          <PropsTable :props="optionsInputProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Toggle">
      <template #description>
        A button based toggle display for managing a boolean value. This
        component should not be viewed much as an input field for tracking a
        payload value, but rather as a button that you can take an action
        against based on it's state.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="toggleCopy" />
        </label>
        <div class="mt-1">
          <div class="space-y-6 mb-4">
            <Toggle
              v-model="toggleValue"
              label="Go on, flip the switch"
              help="Is your refridgerator running?"
              required
              @update:model-value="
                $log(`v-model update event for Toggle: ${$event}`)
              "
            />

            <Toggle
              v-model="toggleValue"
              label="Go on, try and flip the switch"
              disabled
            />
          </div>
          <div class="mt-4"><b>Value:</b> {{ toggleValue }}</div>
          <PropsTable :props="toggleProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Input Label">
      <template #description>
        For whenever you just need a consistent label for a custom layout. Use
        the tag property for a custom html element like legend. The label will
        append a (<span class="text-red-500">*</span>) when the required prop is
        set to true. The component will not render any markup when the label
        prop is empty.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="inputLabelCopy" />
        </label>
        <div class="mt-1">
          <InputLabel label="I'm labeling something..." :required="true" />
          <PropsTable :props="inputLabelProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Input Help">
      <template #description>
        For whenever you just need a consistent help text component. Use the tag
        property for a custom html element like legend. The component will not
        render any markup when the text prop is empty.
      </template>

      <div>
        <label class="block text-sm font-medium text-gray-700">
          <ClickToCopy :value="inputHelpCopy" />
        </label>
        <div class="mt-1">
          <InputHelp
            text="I'm just here to hint and I also _support_ a little __markdown!__"
          />
          <PropsTable :props="inputHelpProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="Input Error">
      <template #description>
        The default error message component used in form inputs. The component
        will not render any markup when the text prop is empty.
      </template>

      <div>
        <div class="mt-1">
          <InputError text="This field is required" />
          <PropsTable :props="inputErrorProps" />
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout
      class="mt-8"
      title="Field Validation and Error State"
      :show-badge="false"
    >
      <template #description>
        The default input validation pattern is to use a late validation.
        Meaning we set the default HTMLInputElement error message when the
        invalid event fires. The invalid event is fired during the
        HTMLFormElement submit event. This allows forms to stay error free until
        it's reported something is wrong. Once an error is present though, we
        clear it or persist it as input and change events fire.
      </template>
      <form id="test-form" @submit.prevent>
        <div class="space-y-8">
          <BaseInput type="text" label="Name" required />

          <BaseInput
            type="email"
            label="Email"
            help="Try using a gmail address!"
            required
          />

          <BaseInput
            type="tel"
            label="Phone"
            help="10 digits please, bonus points for dashes."
            required
          />

          <BaseInput
            type="url"
            label="Website URL"
            help="Don't mangle that protocol."
            required
          />

          <NumberInput
            label="Number"
            name="my-number-input"
            required
            :precision="1"
          />

          <Select :options="options" required label="Select an option" />

          <TextArea label="Fill me out!" required />

          <Radio :options="options" required label="Select an option" />

          <DateRangePicker label="Pick a date range!" required />

          <DateTime label="Pick a date and time local to you!" required />

          <RadioCards
            label="Cards can be required"
            :columns="2"
            :options="options"
            required
          />

          <YesOrNoRadio label="Please confim this field" required />

          <MultiCheckboxes
            label="Minimum selection of 1"
            :columns="2"
            :options="options"
            :min="1"
          />

          <MultiCheckboxes
            label="Maximum selection of 2"
            :columns="2"
            :options="options"
            :max="2"
          />

          <MultiCheckboxes
            label="Somewhere in between"
            help="Pick at least 1, but no more than 2!"
            :columns="2"
            :options="options"
            :min="1"
            :max="2"
          />

          <Checkbox label="You must tick this box" required />

          <FileUpload
            v-model="validationUpload"
            :action="fileUploadMockAction"
            label="Supporting document"
            help="Upload a PDF before submitting this form."
            :accept="['.pdf']"
            required
          />

          <button type="submit" class="xy-btn">Submit</button>
        </div>
      </form>
    </ComponentLayout>

    <ComponentLayout title="File Upload" :show-badge="false">
      <template #description>
        FileUpload sends files to the configured action as soon as they're
        selected. It only puts the uploaded file on the model, so our JSON form
        payloads never end up with browser <code>File</code> or
        <code>Blob</code> values. The schema example below intercepts that
        request in the browser and waits a second before returning a response.
      </template>

      <div class="space-y-8">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">
            <ClickToCopy :value="fileUploadCopy" />
          </label>

          <FileUpload
            v-model="existingUpload"
            action="raw-data-uploads?kind=document"
            label="Engagement letter"
            help="A persisted single-file value."
            :accept="['.pdf']"
            disabled
          />
        </div>

        <InputDisplay
          v-model="fileUploadValues"
          :schema="fileUploadSchema"
          :columns="1"
        />

        <div class="prose max-w-full">
          <h5>Model value</h5>
          <pre><code>{{ fileUploadValues }}</code></pre>
        </div>

        <PropsTable :props="fileUploadInputProps" />

        <div class="prose max-w-full">
          <h5>Upload endpoint</h5>
          <p>
            FileUpload sends one <code>multipart/form-data</code> POST for each
            file. The binary field defaults to <code>file</code>. Use the
            exported <code>bytes</code> helper to set a readable per-file limit,
            such as <code>bytes.megabytes(5)</code>. The response needs this
            shape:
          </p>
          <pre><code>{ "data": { "id": 123, "name": "document.pdf", "url": "..." } }</code></pre>

          <h5>Field repeater</h5>
          <p>
            Stick to single-file mode inside a field repeater so its model stays
            a flat array of uploaded files. Use multi-file inputs as regular
            fields or inside collection repeaters.
          </p>
          <pre><code>{{ fileUploadRepeaterCopy }}</code></pre>
        </div>
      </div>
    </ComponentLayout>

    <ComponentLayout title="FieldsSchema Repeaters" :show-badge="false">
      <template #description>
        A contact information section with field repeaters for notification
        emails and phone numbers, plus a collection repeater for team contacts.
      </template>

      <form class="space-y-8" @submit.prevent>
        <InputDisplay
          v-model="repeaterValues"
          :schema="repeaterSchema"
          :columns="1"
        />

        <div class="flex justify-end">
          <button type="submit" class="xy-btn">Validate repeaters</button>
        </div>
      </form>

      <div class="prose max-w-full">
        <h5>Model value</h5>
        <pre><code>{{ repeaterValues }}</code></pre>
      </div>
    </ComponentLayout>
  </div>
</template>
