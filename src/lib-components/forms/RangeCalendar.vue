<script setup lang="ts">
import type { DateRange as RekaDateRange } from "reka-ui"
import { getLocalTimeZone, CalendarDate } from "@internationalized/date"
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
  useDateFormatter,
} from "reka-ui"
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/solid"
import { computed } from "vue"
import { defaultInputProps, defaultModelOpts } from "@/composables/forms"
import type { DateRangeInput } from "@/composables/forms"
import { calendarDateToUnix } from "@/composables/dateRange"

const formatter = useDateFormatter("en-US")

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<
    DateRangeInput & {
      borderless?: boolean
    }
  >(),
  {
    ...defaultInputProps,
    actions: () => [],
    borderless: false,
  }
)

const modelState = defineModel<DateRangeInput["modelValue"]>({
  ...defaultModelOpts,
  default: { maxDate: 0, minDate: 0 },
})

const selectedRange = computed<RekaDateRange>({
  get: () => {
    if (!modelState.value) {
      return {
        start: undefined,
        end: undefined,
      }
    }

    return {
      start: unixToCalendarDate(modelState.value.minDate),
      end: unixToCalendarDate(modelState.value.maxDate),
    }
  },
  set: (val) => {
    setModelState({
      minDate: val?.start ? calendarDateToUnix(val.start) : 0,
      maxDate: val?.end
        ? Math.floor(
            val.end.toDate(getLocalTimeZone()).setHours(23, 59, 59, 999) / 1000
          )
        : 0,
    })
  },
})

// NOTE(spk): guard against Reka write-back loop when modelState is set
// to zero-values as it will trigger multiple update:model-value events.
const setModelState = (next: NonNullable<DateRangeInput["modelValue"]>) => {
  if (
    modelState.value?.minDate === next.minDate &&
    modelState.value?.maxDate === next.maxDate
  ) {
    return
  }

  modelState.value = next
}

const unixToCalendarDate = (
  unixSeconds?: number | null
): CalendarDate | undefined => {
  if (!unixSeconds) {
    return undefined
  }

  const localDate = new Date(unixSeconds * 1000)
  return new CalendarDate(
    localDate.getFullYear(),
    localDate.getMonth() + 1,
    localDate.getDate()
  )
}

const bounds = computed(() => {
  return {
    maxValue: props.maxValue
      ? new CalendarDate(
          props.maxValue.getFullYear(),
          props.maxValue.getMonth() + 1,
          props.maxValue.getDate()
        )
      : undefined,
    minValue: props.minValue
      ? new CalendarDate(
          props.minValue.getFullYear(),
          props.minValue.getMonth() + 1,
          props.minValue.getDate()
        )
      : undefined,
  }
})

const quickActions = computed(() => {
  return props.actions.map((action) => {
    return {
      label: action.label,
      action: () => {
        setModelState(action.action())
      },
    }
  })
})
</script>

<template>
  <div class="w-full flex items-start justify-start">
    <div
      :class="[
        'bg-white overflow-hidden flex flex-col-reverse lg:flex-row',
        !borderless && 'border border-neutral-100 shadow rounded-xy-lg',
      ]"
    >
      <!--Quick Actions-->
      <div
        v-if="quickActions.length > 0"
        class="lg:max-w-[160px] bg-neutral-50 p-4"
      >
        <button
          v-for="option in quickActions"
          :key="option.label"
          class="flex w-full rounded-md bg-transparent hover:bg-gray-100 transition px-3 py-2 text-xs font-medium"
          @click="option.action"
        >
          {{ option.label }}
        </button>
      </div>

      <div>
        <!-- Calendar Input-->
        <RangeCalendarRoot
          v-slot="{ weekDays, grid }"
          v-model="selectedRange"
          :class="[
            'xy-range-calendar flex space-y-4 flex-col lg:flex-row lg:space-y-0 p-4',
            maxRange && 'xy-range-calendar--maximum-days',
          ]"
          :number-of-months="1"
          locale="en-US"
          :maximum-days="maxRange"
          :max-value="bounds.maxValue"
          :min-value="bounds.minValue"
        >
          <div
            v-for="(month, index) in grid"
            :key="month.value.toString()"
            :class="{ 'mr-4': index === 0 }"
          >
            <div v-if="index === 0" class="flex items-center">
              <RangeCalendarPrev
                class="xy-btn-neutral-sm xy-range-calendar-nav"
              >
                <ChevronLeftIcon class="w-4 h-4" />
              </RangeCalendarPrev>

              <!--Left Month Date Display-->
              <span
                class="text-sm font-semibold text-xy-black flex-1 text-center"
                >{{
                  formatter.custom(month.value.toDate(getLocalTimeZone()), {
                    month: "long",
                    year: "numeric",
                  })
                }}</span
              >

              <RangeCalendarNext
                class="xy-btn-neutral-sm xy-range-calendar-nav"
              >
                <ChevronRightIcon class="w-4 h-4" />
              </RangeCalendarNext>
            </div>

            <div class="pt-4">
              <RangeCalendarGrid class="w-full select-none space-y-1">
                <RangeCalendarGridHead>
                  <RangeCalendarGridRow class="mb-1 grid w-full grid-cols-7">
                    <RangeCalendarHeadCell
                      v-for="day in weekDays"
                      :key="day"
                      class="text-xs text-xy-blue-600 font-bold"
                    >
                      {{ day }}
                    </RangeCalendarHeadCell>
                  </RangeCalendarGridRow>
                </RangeCalendarGridHead>

                <RangeCalendarGridBody class="grid">
                  <RangeCalendarGridRow
                    v-for="(weekDates, rowIndex) in month.rows"
                    :key="`weekDate-${rowIndex}`"
                    class="grid grid-cols-7"
                  >
                    <RangeCalendarCell
                      v-for="weekDate in weekDates"
                      :key="weekDate.toString()"
                      :date="weekDate"
                      class="xy-range-calendar-cell"
                    >
                      <RangeCalendarCellTrigger
                        :day="weekDate"
                        :month="month.value"
                        class="xy-range-calendar-day"
                      />
                    </RangeCalendarCell>
                  </RangeCalendarGridRow>
                </RangeCalendarGridBody>
              </RangeCalendarGrid>
            </div>
          </div>
        </RangeCalendarRoot>
      </div>
    </div>
  </div>
</template>
