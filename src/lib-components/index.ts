// TODO: rearrange so that these are default installed by app.use(Trees);

// Layout components
import { default as ActionsDropdown } from "./navigation/ActionsDropdown.vue"
import { default as Cards } from "./lists/Cards.vue"
import { default as ContentModal } from "./overlays/ContentModal.vue"
import { default as DateFilter } from "./layout/DateFilter.vue"
import { default as DetailList } from "./lists/DetailList.vue"
import { default as DownloadCell } from "./lists/DownloadCell.vue"
import { default as Flash } from "./overlays/Flash.vue"
import { default as Modal } from "./overlays/Modal.vue"
import { default as SidebarLayout } from "./layout/SidebarLayout.vue"
import { default as Slideover } from "./overlays/Slideover.vue"
import { default as StackedLayout } from "./layout/StackedLayout.vue"
import { default as Paginator } from "./navigation/Paginator.vue"
import { default as Spinner } from "./overlays/Spinner.vue"
import { default as StaticTable } from "./lists/StaticTable.vue"
import { default as Steps } from "./navigation/Steps.vue"
import { default as Table } from "./lists/Table.vue"
import { default as Tabs } from "./navigation/Tabs.vue"
import { default as Toggle } from "./forms/Toggle.vue"

// Form components
import { default as BaseInput } from "./forms/BaseInput.vue"
import { default as Checkbox } from "./forms/Checkbox.vue"
import { default as DateRangePicker } from "./forms/DateRangePicker.vue"
import { default as InputHelp } from "./forms/InputHelp.vue"
import { default as InputLabel } from "./forms/InputLabel.vue"
import { default as MultiCheckboxes } from "./forms/MultiCheckboxes.vue"
import { default as Radio } from "./forms/Radio.vue"
import { default as Select } from "./forms/Select.vue"
import { default as TextArea } from "./forms/TextArea.vue"
import { default as YesOrNoRadio } from "./forms/YesOrNoRadio.vue"

export {
  ActionsDropdown,
  Cards,
  ContentModal,
  DateFilter,
  DetailList,
  DownloadCell,
  Flash,
  Modal,
  SidebarLayout,
  Slideover,
  StackedLayout,
  Paginator,
  Spinner,
  StaticTable,
  Steps,
  Table,
  Tabs,
  Toggle,
  BaseInput,
  Checkbox,
  DateRangePicker,
  InputHelp,
  InputLabel,
  MultiCheckboxes,
  Radio,
  Select,
  TextArea,
  YesOrNoRadio,
}

/**
 * declare global component types for App.use(Trees)
 */
declare module "@vue/runtime-core" {
  interface GlobalComponents {
    ActionsDropdown: InstanceType<typeof ActionsDropdown>
    Cards: InstanceType<typeof Cards>
    ContentModal: InstanceType<typeof ContentModal>
    DateFilter: InstanceType<typeof DateFilter>
    DetailList: InstanceType<typeof DetailList>
    DownloadCell: InstanceType<typeof DownloadCell>
    Flash: InstanceType<typeof Flash>
    Modal: InstanceType<typeof Modal>
    SidebarLayout: InstanceType<typeof SidebarLayout>
    Slideover: InstanceType<typeof Slideover>
    StackedLayout: InstanceType<typeof StackedLayout>
    Paginator: InstanceType<typeof Paginator>
    Spinner: InstanceType<typeof Spinner>
    StaticTable: InstanceType<typeof StaticTable>
    Steps: InstanceType<typeof Steps>
    Table: InstanceType<typeof Table>
    Tabs: InstanceType<typeof Tabs>
    Toggle: InstanceType<typeof Toggle>
    BaseInput: InstanceType<typeof BaseInput>
    Checkbox: InstanceType<typeof Checkbox>
    DateRangePicker: InstanceType<typeof DateRangePicker>
    InputHelp: InstanceType<typeof InputHelp>
    InputLabel: InstanceType<typeof InputLabel>
    MultiCheckboxes: InstanceType<typeof MultiCheckboxes>
    Radio: InstanceType<typeof Radio>
    Select: InstanceType<typeof Select>
    TextArea: InstanceType<typeof TextArea>
    YesOrNoRadio: InstanceType<typeof YesOrNoRadio>
  }
}
