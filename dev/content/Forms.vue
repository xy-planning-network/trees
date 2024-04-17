<script setup lang="ts">
import { ref } from "vue"
import { InputOption, TextInputType, textInputTypes } from "@/composables/forms"

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

/**
 * v-models
 */
const inputTypeSelected = ref<TextInputType>("text")
const inputVals = ref<Record<string, any>>({})
const toggleValue = ref(undefined)
const dateTimeInput = ref<string>("2015-08-01T15:30:00.000Z")
/**
 * Copy Help
 */
const checkboxCopy = `<Checkbox label="I'm here to party!" help="Get notified when the party starts." v-model="checked" />`
const dateRangePickerCopy = `<DateRangePicker v-model="dateRange" />`
const dateTimeCopy = `<DateTime v-model="dateTime" label="Select a date and time" help="Use your local timezone!" />`
const inputCopy = `<BaseInput type="text" label="What's your lide moto?" help="No wrong ansswers here." placeholder="It's good to be alive" />`
const multiCheckboxCopy = `<MultiCheckboxes v-model="selected" label="Make Some Selections" help="Select all that apply." :options="options" />`
const radioCopy = `<Radio :options="options" v-model="selected" />`
const selectCopy = `<Select :options="options" placeholder="Select an option that you fancy" />`
const yesOrNoRadioCopy = `<YesOrNoRadio v-model="selected" />`
const textareaCopy = `<TextArea v-model="textarea" />`
const inputLabelCopy = `<InputLabel label="I'm labeling something..." />`
const toggleCopy = `<Toggle v-model="toggleValue"></Toggle>`
const inputHelpCopy = `<InputHelp text="I'm just here to hint." />`

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
    name: "modelValue",
    required: false,
    type: `{minDate: number, maxDate: number}`,
  },
  { name: "maxRange", required: false, type: "number" },
  { name: "startDate", required: false, type: "number" },
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

const toggleProps = [
  { name: "modelValue", required: false, type: "boolean" },
  { name: "label", required: false, type: "string" },
  { name: "help", required: false, type: "string" },
]
</script>

<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <ComponentLayout title="Input HTML Attributes" :show-badge="false">
        <template #description>
          <div class="mt-4">
            Generally, all of these inputs will support common html attributes
            such as <code>disabled</code> and <code>required</code> or input
            specific attributes like <code>rows</code> for textareas.
          </div>

          <div class="mt-4">
            Out of the box they will support a dynamically generated id
            attribute which is used for accessibility concerns with labels and
            help text.
          </div>
        </template>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Base Input">
        <template #description>
          Covers many of the most common <code>&lt;input&gt;</code> fields with
          a <code>type="${type}"</code> attribute. Checkout the list of common
          <a
            href="https://developer.mozilla.org/en-US/docs/Learn/Forms/HTML5_input_types"
            class="xy-link"
            target="_blank"
            >input variations</a
          >.
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

      <ComponentLayout class="mt-8" title="Textarea">
        <template #description>
          A common and consistent textarea input.
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

      <ComponentLayout class="mt-8" title="Checkbox">
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

      <ComponentLayout class="mt-8" title="Date Range Picker">
        <template #description>
          We are using
          <a
            href="https://developer.mozilla.org/en-US/docs/Learn/Forms/HTML5_input_types"
            class="xy-link"
            target="_blank"
            >flatpickr</a
          >
          to select date ranges. They package up some css to make it all look
          fresh.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="dateRangePickerCopy" />
          </label>
          <div class="mt-1">
            <DateRangePicker
              v-model="inputVals['dateRangePicker']"
              :max-range="365"
              required
            />

            <div class="mt-4">
              <b>Value:</b> {{ inputVals["dateRangePicker"] }}
            </div>
            <PropsTable :props="dateRangeInputProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Date Time Input">
        <template #description>
          The DateTime input wraps the HTML datetime-local type input and
          handles the v-model mutations necessary to adhere to the RFC 3339 date
          format. Like BaseInput, this component will forward attributes like
          disabled, max, min, required, and step.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="dateTimeCopy" />
          </label>
          <div class="mt-1">
            <DateTime v-model="inputVals['dateTimeLocal']" required />

            <div class="mt-4">
              <b>Value:</b> {{ inputVals["dateTimeLocal"] }}
            </div>

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

      <ComponentLayout class="mt-8" title="Multi Checkboxes">
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

      <ComponentLayout class="mt-8" title="Radio">
        <template #description>
          Similar to checkboxes, these are wrapped in a vue component given
          their nested structure so that we are consistent across all projects.
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
                The <code>sublabel</code> slot receives the following scoped
                slot props:
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

            <div class="mt-4"><b>Value:</b> {{ inputVals["radio"] }}</div>
            <PropsTable :props="optionsInputProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Select">
        <template #description>
          Similar to checkboxes, these are wrapped in a vue component given
          their nested structure so that we are consistent across all projects.
          <br /><br />Note that the
          <a
            class="xy-link"
            href="https://v3.vuejs.org/guide/forms.html#value-bindings"
            >Value Bindings</a
          >
          section of the Vue docs states that binding values for selects are
          usually static strings. Use the <b>v-model.number </b>
          <a class="xy-link" href="https://v3.vuejs.org/guide/forms.html#number"
            >modifier</a
          >
          if you need the binding to be typecast as a number.
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
            />

            <Select
              v-model="inputVals['select']"
              :options="options"
              label="Lets make a selection"
              help="Disabled select input"
              disabled
            />
          </div>

          <div class="mt-4"><b>Value:</b> {{ inputVals["select"] }}</div>
          <PropsTable :props="optionsInputProps" />
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Yes or No Radio">
        <template #description>
          This is a "yes" or "no" UI form input that maps to a boolean. You
          could even use it in a truth or dare app. Whoa.
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
            ></YesOrNoRadio>
            <div class="mt-2">
              <YesOrNoRadio
                v-model="inputVals['yesOrNoRadio']"
                label="Is this thing on? (disabled)"
                disabled
              ></YesOrNoRadio>
            </div>
            <div class="mt-4">
              <b>Value:</b> {{ inputVals["yesOrNoRadio"] }}
            </div>
            <PropsTable :props="optionsInputProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Toggle">
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

      <ComponentLayout class="mt-8" title="Input Label">
        <template #description>
          For whenever you just need a consistent label for a custom layout. Use
          the tag property for a custom html element like legend. The label will
          append a (<span class="text-red-500">*</span>) when the required prop
          is set to true. The component will not render any markup when the
          label prop is empty.
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

      <ComponentLayout class="mt-8" title="Input Help">
        <template #description>
          For whenever you just need a consistent help text component. Use the
          tag property for a custom html element like legend. The component will
          not render any markup when the text prop is empty.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="inputHelpCopy" />
          </label>
          <div class="mt-1">
            <InputHelp text="I'm just here to hint" />
            <PropsTable :props="inputHelpProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Input Error">
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
          HTMLFormElement submit event. This allows forms to stay error free
          until it's reported something is wrong. Once an error is present
          though, we clear it or persist it as input and change events fire.
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
              label="More selections is better"
              help="Pick at least 1, but no more than 2!"
              :columns="2"
              :options="options"
              :min="1"
              :max="2"
            />

            <Checkbox label="You must tick this box" required />

            <button type="submit" class="xy-btn">Submit</button>
          </div>
        </form>
      </ComponentLayout>
    </div>
  </div>
</template>
