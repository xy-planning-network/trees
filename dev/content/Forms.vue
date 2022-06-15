<script setup lang="ts">
import { ref } from "vue"

const commonProps = [
  { name: "label", required: false, type: "string" },
  { name: "help", required: false, type: "string" },
]
const checked = ref(true)
const checkboxCopy = `<Checkbox label="I'm here to party!" help="Get notified when the party starts." v-model="checked" />`
const checkboxProps = [
  { name: "emphasis", required: false, type: "boolean" },
  { name: "label", required: false, type: "string" },
  { name: "modelValue", required: true, type: "boolean" },
]
const dateRange = ref({ maxDate: 0, minDate: 0 })
const dateRangePickerCopy = `<DateRangePicker v-model="dateRange" />`
const dateRangePickerProps = [
  {
    name: "modelValue",
    required: true,
    type: "{ minDate: number; maxDate: number; }",
  },
  { name: "startDate", required: false, type: "number" },
  ...commonProps,
]
const inputCopy = `<BaseInput type="text" label="What's your lide moto?" help="No wrong ansswers here." placeholder="It's good to be alive"/>`
const inputErrorCopy = `<BaseInput type="text" placeholder="Broken" class="xy-input-error" />`
const multiCheckboxCopy = `<MultiCheckboxes v-model="selected" legend="Make Some Selections" help="Select all that apply." :options="options" />`
const multiCheckboxProps = [
  {
    name: "options",
    required: true,
    type: "Array<{ disabled?: boolean, help?: string; label: string; value: number | string }>",
  },
  { name: "modelValue", required: true, type: "string" },
  { name: "legend", required: false, type: "string" },
]
const multiCheckboxSelection = ref(["val2", 4])
const radioCopy = `<Radio :options="options" v-model="selected" />`
const radioProps = [
  {
    name: "options",
    required: true,
    type: "Array<{ disabled?: boolean, help?: string, label: string; value: number | string }>",
  },
  { name: "modelValue", required: true, type: "string" },
  { name: "help", required: false, type: "string" },
  { name: "legend", required: false, type: "string" },
]
const radioSelection = ref<string | number>()
const selectCopy = `<Select :options="options" placeholder="Select an option that you fancy" />`
const selectProps = [
  { name: "design", required: false, type: "string" },
  {
    name: "options",
    required: true,
    type: "Array<{ label: string; value: string | number }>",
  },
  { name: "placeholder", required: false, type: "string" },
  { name: "modelValue", required: true, type: "string" },
  ...commonProps,
]
const options = [
  {
    label: "You could select this",
    help: "It's really quite nice.",
    value: "val1",
  },
  {
    label: "This is an option",
    help: "Ah, indeed it is an option.",
    value: "val2",
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

const selected = ref("")

const yesOrNoRadioCopy = `<YesOrNoRadio v-model="selected" />`
const yesOrNoRadioSelection = ref(undefined)
const yesOrNoRadioProps = [
  { name: "help", required: false, type: "string" },
  { name: "legend", required: false, type: "string" },
  { name: "name", required: false, type: "string" },
  { name: "modelValue", required: false, type: "boolean" },
]

const textarea = ref("")
const textareaProps = [
  { name: "modelValue", required: false, type: "string" },
  ...commonProps,
]
const textareaCopy = `<TextArea v-model="textarea" />`

const baseInputProps = [
  { name: "type", required: true, type: "string" },
  { name: "modelValue", required: false, type: "string | number" },
  ...commonProps,
]

const inputTypes = [
  "color",
  "date",
  "datetime-local",
  "email",
  "file",
  "hidden",
  "month",
  "number",
  "password",
  "range",
  "search",
  "tel",
  "text",
  "time",
  "url",
  "week",
].map((type: string) => {
  return {
    label: type,
    value: type,
  }
})

const inputTypeSelected = ref("text")
const customInputTypeVal = ref("")

const inputLabelCopy = `<InputLabel label="I'm labeling something..." />`
const inputLabelProps = [
  { name: "label", required: false, type: "string" },
  { name: "tag", required: false, type: "string" },
]

const inputHelpCopy = `<InputHelp text="I'm just here to hint." />`
const inputHelpProps = [
  { name: "text", required: false, type: "string" },
  { name: "tag", required: false, type: "string" },
]
const toggleValue = ref(false)
const toggleCopy = `<Toggle v-model="toggleValue"></Toggle>`
const toggleProps = [{ name: "modelValue", required: true, type: "string" }]
</script>
<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <ComponentLayout title="Input HTML Attributes" :show-badge="false">
        <template v-slot:description>
          <div class="mt-4">
            Generally, all of these inputs will support common html attributes
            such as <code>disabled</code> and <code>required</code> or input
            specific attributes like <code>rows</code> for textareas. You can
            even use the <code>class</code> attribute as needed to apply
            additional classes.
          </div>

          <div class="mt-4">
            Out of the box they will support a dynamically generated id
            attribute which is used for accessibility concerns with labels and
            help text.
          </div>
        </template>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Base Input">
        <template v-slot:description>
          Covers many of the most common <code>&lt;input&gt;</code> fields with
          a <code>type="${type}"</code> attribute. Checkout the list of common
          <a
            href="https://developer.mozilla.org/en-US/docs/Learn/Forms/HTML5_input_types"
            class="xy-link"
            target="_blank"
            >input variations</a
          >. Errors can be styled with <code>.xy-input-error</code>.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="inputCopy" />
          </label>
          <div class="mt-1">
            <BaseInput
              help="No wrong answers here."
              type="text"
              label="What's your life moto?"
              placeholder="It's good to be alive"
            ></BaseInput>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="inputErrorCopy" />
          </label>
          <div class="mt-1">
            <BaseInput
              type="text"
              label="Broken"
              class="xy-input-error"
            ></BaseInput>
          </div>
        </div>

        <div>
          <div class="mt-1">
            <BaseInput
              :disabled="true"
              type="text"
              label="Disabled"
            ></BaseInput>
          </div>
        </div>

        <div>
          <div class="border-t pt-4 mt-4">
            <Select
              :options="inputTypes"
              label="Try out some common input types"
              placeholder="Select an input type"
              v-model="inputTypeSelected"
              class="mb-8"
            />
            <BaseInput
              :help="`Some help text for a ${inputTypeSelected}`"
              :type="inputTypeSelected"
              :label="`Here's an example of an <input type='${inputTypeSelected}'>`"
              :placeholder="`A placeholder for a ${inputTypeSelected}`"
              v-model="customInputTypeVal"
            ></BaseInput>
            <div class="mt-4"><b>Value:</b> {{ customInputTypeVal }}</div>
            <PropsTable :props="baseInputProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Textarea">
        <template v-slot:description>
          A common and consistent textarea input.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="textareaCopy" />
          </label>
          <div class="mt-1">
            <TextArea
              v-model="textarea"
              label="How about it (disabled)?"
              help="In your own words."
            />

            <div class="mt-4">
              <TextArea
                :disabled="true"
                label="How about it (disabled)?"
                help="In your own words."
                v-model="textarea"
              />
            </div>
            <div class="mt-4"><b>Value:</b> {{ textarea }}</div>
            <PropsTable :props="textareaProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Checkbox">
        <template v-slot:description>
          Checkboxes are a wrapped component given that they have a complex
          structure.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="checkboxCopy" />
          </label>
          <div class="mt-1 space-y-8">
            <Checkbox
              label="I'm here to party!"
              help="Get notified when the party starts."
              v-model="checked"
            />

            <Checkbox
              :disabled="true"
              label="I'm here to party! (disabled)"
              help="Get notified when the party starts."
              v-model="checked"
            />

            <Checkbox
              label="I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party! I'm here to party!"
              v-model="checked"
            />

            <div class="mt-4"><b>Value:</b> {{ checked }}</div>
            <PropsTable :props="checkboxProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Date Range Picker">
        <template v-slot:description>
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
            <DateRangePicker v-model="dateRange" />
            <div class="mt-4"><b>Value:</b> {{ dateRange }}</div>
            <PropsTable :props="dateRangePickerProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Multi Checkboxes">
        <template v-slot:description>
          This can be used to select an array of values.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="multiCheckboxCopy" />
          </label>
          <div class="mt-1 space-y-8">
            <MultiCheckboxes
              legend="Make Basic Selections"
              :options="
                options.map((option) => ({
                  disabled: option.disabled,
                  label: option.label,
                  value: option.value,
                }))
              "
              v-model="multiCheckboxSelection"
            />

            <MultiCheckboxes
              legend="Make Complex Selections"
              help="Select all that apply."
              :options="options"
              disabled
              v-model="multiCheckboxSelection"
            />

            <MultiCheckboxes
              :columns="2"
              help="Set the columns prop to 2, 3, or 4"
              :options="options"
              v-model="multiCheckboxSelection"
            >
              <template #legend>In A Grid Too</template>
            </MultiCheckboxes>

            <div class="mt-2"><b>Value:</b> {{ multiCheckboxSelection }}</div>
            <PropsTable :props="multiCheckboxProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Radio">
        <template v-slot:description>
          Similar to checkboxes, these are wrapped in a vue component given
          their nested structure so that we are consistent across all projects.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="radioCopy" />
          </label>
          <div class="mt-1 space-y-8">
            <Radio
              legend="Make Basic Choice"
              :options="
                options.map((option) => ({
                  disabled: option.disabled,
                  label: option.label,
                  value: option.value,
                }))
              "
              v-model="radioSelection"
            />

            <Radio
              legend="Make Complex Choice"
              help="Only one - I know it's hard!"
              :options="options"
              disabled
              v-model="radioSelection"
            />

            <Radio
              help="Set the columns prop to 2, 3, or 4"
              :options="options"
              v-model="radioSelection"
              :columns="undefined"
              required
            >
              <template #legend>In A Grid Too</template>
            </Radio>

            <div class="">
              <form>
                <RadioCards
                  legend="Cards Any One?"
                  help="Just use the RadioCards component."
                  :options="
                    options.map((option) => ({
                      disabled: option.disabled,
                      label: option.label,
                      value: option.value,
                    }))
                  "
                  v-model="radioSelection"
                  :columns="2"
                  name="my_input"
                  required
                />
                <input class="xy-btn mt-2" type="submit" value="submit" />
              </form>
            </div>

            <div class="">
              <RadioCards
                :disabled="true"
                legend="Cards Any One?"
                help="Just use the RadioCards component."
                :options="
                  options.map((option) => ({
                    disabled: option.disabled,
                    help: option.help,
                    label: option.label,
                    value: option.value,
                    sublabel: '$499/mo',
                  }))
                "
                v-model="radioSelection"
                :columns="2"
              />
            </div>

            <div class="mt-4"><b>Value:</b> {{ radioSelection }}</div>
            <PropsTable :props="radioProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Select">
        <template v-slot:description>
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
          <div class="mt-1">
            <Select
              :options="options"
              v-model="selected"
              placeholder="Lets make a selection"
            />
            <div class="mt-4"><b>Value:</b> {{ selected }}</div>
            <PropsTable :props="selectProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Yes or No Radio">
        <template v-slot:description>
          This is a "yes" or "no" UI form input that maps to a boolean. You
          could even use it in a truth or dare app. Whoa.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="yesOrNoRadioCopy" />
          </label>
          <div class="mt-1">
            <YesOrNoRadio
              legend="Is this thing on?"
              help="Only one way to find out."
              v-model="yesOrNoRadioSelection"
            ></YesOrNoRadio>
            <div class="mt-2">
              <YesOrNoRadio
                legend="Is this thing on? (disabled)"
                v-model="yesOrNoRadioSelection"
                disabled
              ></YesOrNoRadio>
            </div>
            <div class="mt-4"><b>Value:</b> {{ yesOrNoRadioSelection }}</div>
            <PropsTable :props="yesOrNoRadioProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Toggle">
        <template v-slot:description>
          Just a another toggle for boolean switches. A great UI alternative to
          checkboxes and boolean value radio button pairs. Currently does not
          support a label property. Bring your own label.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="toggleCopy" />
          </label>
          <div class="mt-1">
            <Toggle v-model="toggleValue"></Toggle>
            <div class="mt-4"><b>Value:</b> {{ toggleValue }}</div>
            <PropsTable :props="toggleProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Input Label">
        <template v-slot:description>
          For whenever you just need a consistent label for a custom layout. Use
          the tag property for a custom html element like legend.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="inputLabelCopy" />
          </label>
          <div class="mt-1">
            <InputLabel label="I'm labeling something..." />
            <PropsTable :props="inputLabelProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Input Help">
        <template v-slot:description>
          For whenever you just need a consistent help text component. Use the
          tag property for a custom html element like legend.
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
    </div>
  </div>
</template>
