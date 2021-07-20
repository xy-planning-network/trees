<template>
  <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <ComponentLayout title="Checkbox">
        <template v-slot:description>
          Checkboxes are a wrapped component given that they have a complex
          structure.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="checkboxCopy" />
          </label>
          <div class="mt-1">
            <Checkbox label="I'm here to party!" v-model="checked" />
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
            <PropsTable :props="dateRangePickerProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" :css-component="true" title="Input">
        <template v-slot:description>
          These aren't using any extra magic other than css. They are styled
          based off <code>type="text"</code> or one of the
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
            <input type="text" placeholder="It's good to be alive" />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="inputErrorCopy" />
          </label>
          <div class="mt-1">
            <input type="text" placeholder="Broken" class="xy-input-error" />
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
          <div class="mt-1">
            <MultiCheckboxes
              :options="options"
              v-model="multiCheckboxSelection"
            />
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
          <div class="mt-1">
            <Radio :options="options" v-model="radioSelection" />
            <PropsTable :props="radioProps" />
          </div>
        </div>
      </ComponentLayout>

      <ComponentLayout class="mt-8" title="Select">
        <template v-slot:description>
          Similar to checkboxes, these are wrapped in a vue component given
          their nested structure so that we are consistent across all projects.
        </template>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            <ClickToCopy :value="selectCopy" />
          </label>
          <div class="mt-1">
            <Select
              :options="options"
              placeholder="Select an option that you fancy"
              v-model="selected"
            />
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
            <YesOrNoRadio v-model="yesOrNoRadioSelection" />
            <PropsTable :props="yesOrNoRadioProps" />
          </div>
        </div>
      </ComponentLayout>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-property-decorator";

@Options({ name: "Forms" })
export default class Forms extends Vue {
  checked = false;
  checkboxCopy = `<Checkbox label="I'm here to party!" v-model="checked" />`;
  checkboxProps = [
    { name: "disabled", required: false, type: "boolean" },
    { name: "emphasis", required: false, type: "boolean" },
    { name: "label", required: false, type: "string" },
    { name: "required", required: false, type: "boolean" },
    { name: "modelValue", required: true, type: "boolean" },
  ];
  dateRange = { maxRange: 0, minRange: 0 };
  dateRangePickerCopy = `<DateRangePicker v-model="dateRange" />`;
  dateRangePickerProps = [
    {
      name: "modelValue",
      required: true,
      type: "{ minDate: number; maxDate: number; }",
    },
    { name: "startDate", required: false, type: "number" },
  ];
  inputCopy = `<input type="text" placeholder="It's good to be alive" />`;
  inputErrorCopy = `<input type="text" placeholder="Broken" class="xy-input-error" />`;
  multiCheckboxCopy = `<MultiCheckboxes :options="options" v-model="selected" />`;
  multiCheckboxProps = [
    {
      name: "options",
      required: true,
      type: "Array<{ label: string; value: string }>",
    },
    { name: "modelValue", required: true, type: "string" },
  ];
  multiCheckboxSelection = [];
  radioCopy = `<Radio :options="options" v-model="selected" />`;
  radioProps = [
    { name: "disabled", required: false, type: "boolean" },
    {
      name: "options",
      required: true,
      type: "Array<{ label: string; value: string }>",
    },
    { name: "required", required: false, type: "boolean" },
    { name: "modelValue", required: true, type: "string" },
  ];
  radioSelection = "";
  selectCopy = `<Select :options="options" placeholder="Select an option that you fancy" />`;
  selectProps = [
    { name: "design", required: false, type: "string" },
    {
      name: "options",
      required: true,
      type: "Array<{ label: string; value: string }>",
    },
    { name: "placeholder", required: false, type: "string" },
    { name: "modelValue", required: true, type: "string" },
  ];
  options = [
    { label: "You could select this", value: "val1" },
    { label: "This is an option", value: "val2" },
    { label: "Feeling good about this one?", value: "val3" },
    { label: "This is the LAST option", value: "val4" },
  ];
  selected = "";
  yesOrNoRadioCopy = `<YesOrNoRadio v-model="selected" />`;
  yesOrNoRadioSelection = false;
  yesOrNoRadioProps = [
    { name: "disabled", required: false, type: "boolean" },
    { name: "required", required: false, type: "boolean" },
    { name: "modelValue", required: false, type: "boolean" },
  ];
}
</script>
