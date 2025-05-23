// TODO: rearrange so that these are default installed by app.use(Trees);

// Layout components
import { default as ActionsDropdown } from "./navigation/ActionsDropdown.vue"
import { default as Cards } from "./lists/Cards.vue"
import { default as ContentModal } from "./overlays/ContentModal.vue"
import { default as DateFilter } from "./layout/DateFilter.vue"
import { default as DetailList } from "./lists/DetailList.vue"
import { default as DownloadCell } from "./lists/DownloadCell.vue"
import { default as Flash } from "./overlays/Flash.vue"
import { default as InlineAlert } from "./indicators/InlineAlert.vue"
import { default as Modal } from "./overlays/Modal.vue"
import { default as SidebarLayout } from "./layout/SidebarLayout.vue"
import { default as Popover } from "./overlays/Popover/Popover.vue"
import { default as PopoverPosition } from "./overlays/Popover/Popover.vue"
import { default as PopoverContent } from "./overlays/Popover/PopoverContent.vue"
import { default as Slideover } from "./overlays/Slideover.vue"
import { default as Tooltip } from "./overlays/Tooltip.vue"
import { default as StackedLayout } from "./layout/StackedLayout.vue"
import { default as Paginator } from "./navigation/Paginator.vue"
import { default as Spinner } from "./overlays/Spinner.vue"
import { default as DataTable } from "./lists/DataTable.vue"
import { default as Steps } from "./navigation/Steps.vue"
import { default as DynamicTable } from "./lists/DynamicTable.vue"
import { default as TablePaginator } from "./navigation/TablePaginator.vue"
import { default as Tabs } from "./navigation/Tabs.vue"
import { default as Toggle } from "./forms/Toggle.vue"
import { default as XYSpinner } from "./indicators/XYSpinner.vue"
import { default as ProgressCircles } from "./indicators/ProgressCircles.vue"
import { default as ProgressCirclesLabeled } from "./indicators/ProgressCirclesLabeled.vue"

// Form components
import { default as BaseInput } from "./forms/BaseInput.vue"
import { default as Checkbox } from "./forms/Checkbox.vue"
import { default as DateRangePicker } from "./forms/DateRangePicker.vue"
import { default as DateTime } from "./forms/DateTimeInput.vue"
import { default as InputError } from "./forms/InputError.vue"
import { default as InputHelp } from "./forms/InputHelp.vue"
import { default as InputLabel } from "./forms/InputLabel.vue"
import { default as FieldsetLegend } from "./forms/FieldsetLegend.vue"
import { default as MultiCheckboxes } from "./forms/MultiCheckboxes.vue"
import { default as NumberInput } from "./forms/NumberInput.vue"
import { default as Radio } from "./forms/Radio.vue"
import { default as RadioCards } from "./forms/RadioCards.vue"
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
  InlineAlert,
  Modal,
  SidebarLayout,
  Slideover,
  StackedLayout,
  Popover,
  PopoverContent,
  PopoverPosition, // Type export
  Paginator,
  Spinner,
  DataTable,
  Steps,
  DynamicTable,
  Tabs,
  TablePaginator,
  Toggle,
  Tooltip,
  BaseInput,
  Checkbox,
  DateRangePicker,
  DateTime,
  InputError,
  InputHelp,
  InputLabel,
  FieldsetLegend,
  MultiCheckboxes,
  NumberInput,
  Radio,
  RadioCards,
  Select,
  TextArea,
  YesOrNoRadio,
  XYSpinner,
  ProgressCircles,
  ProgressCirclesLabeled,
}

/**
 * declare global component types for App.use(Trees)
 */
export interface TreesComponents {
  ActionsDropdown: typeof ActionsDropdown
  Cards: typeof Cards
  ContentModal: typeof ContentModal
  DateFilter: typeof DateFilter
  DetailList: typeof DetailList
  DownloadCell: typeof DownloadCell
  Flash: typeof Flash
  Modal: typeof Modal
  SidebarLayout: typeof SidebarLayout
  Slideover: typeof Slideover
  Popover: typeof Popover
  PopoverContent: typeof PopoverContent
  StackedLayout: typeof StackedLayout
  Paginator: typeof Paginator
  Spinner: typeof Spinner
  DataTable: typeof DataTable
  DynamicTable: typeof DynamicTable
  Steps: typeof Steps
  Tabs: typeof Tabs
  TablePaginator: typeof TablePaginator
  Toggle: typeof Toggle
  Tooltip: typeof Tooltip
  BaseInput: typeof BaseInput
  Checkbox: typeof Checkbox
  DateRangePicker: typeof DateRangePicker
  DateTime: typeof DateTime
  InputError: typeof InputError
  InputHelp: typeof InputHelp
  InputLabel: typeof InputLabel
  FieldsetLegend: typeof FieldsetLegend
  MultiCheckboxes: typeof MultiCheckboxes
  NumberInput: typeof NumberInput
  Radio: typeof Radio
  RadioCards: typeof RadioCards
  Select: typeof Select
  TextArea: typeof TextArea
  YesOrNoRadio: typeof YesOrNoRadio
  XYSpinner: typeof XYSpinner
  ProgressCircles: typeof ProgressCircles
  ProgressCirclesLabeled: typeof ProgressCirclesLabeled
}
