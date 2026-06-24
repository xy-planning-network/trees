/**
 * This file contains a collection of "Quick Actions" that can be used
 * with DateRangePicker, so offer convenience ranges that a user can select at
 * the click of a button.
 */
import { DateRangeAction } from "@/entry"
import { today, getLocalTimeZone } from "@internationalized/date"
import type { DateValue } from "reka-ui"

export const calendarDateToUnix = (date: DateValue): number => {
  return Math.floor(date.toDate(getLocalTimeZone()).getTime() / 1000)
}

export const dateRangeLast7Days: DateRangeAction = {
  label: "Last 7 days",
  action: () => {
    const now = today(getLocalTimeZone())
    return {
      minDate: calendarDateToUnix(now.subtract({ days: 6 })),
      maxDate: calendarDateToUnix(now),
    }
  },
}

export const dateRangeLast30Days: DateRangeAction = {
  label: "Last 30 days",
  action: () => {
    const now = today(getLocalTimeZone())
    return {
      minDate: calendarDateToUnix(now.subtract({ days: 29 })), // 29 days ago + today = 30 days
      maxDate: calendarDateToUnix(now),
    }
  },
}

export const dateRangeThisMonth: DateRangeAction = {
  label: "This month",
  action: () => {
    const now = today(getLocalTimeZone())
    return {
      minDate: calendarDateToUnix(now.set({ day: 1 })),
      maxDate: calendarDateToUnix(now),
    }
  },
}

export const dateRangeLastMonth: DateRangeAction = {
  label: "Last month",
  action: () => {
    const startOfLastMonth = today(getLocalTimeZone())
      .subtract({ months: 1 })
      .set({ day: 1 })

    return {
      minDate: calendarDateToUnix(startOfLastMonth),
      maxDate: calendarDateToUnix(
        startOfLastMonth.add({ months: 1 }).subtract({ days: 1 })
      ),
    }
  },
}

export const dateRangeThisYear: DateRangeAction = {
  label: "This year",
  action: () => {
    const now = today(getLocalTimeZone())
    return {
      minDate: calendarDateToUnix(now.set({ month: 1, day: 1 })),
      maxDate: calendarDateToUnix(now),
    }
  },
}

export const dateRangeLastYear: DateRangeAction = {
  label: "Last year",
  action: () => {
    const startOfLastYear = today(getLocalTimeZone())
      .subtract({ years: 1 })
      .set({ month: 1, day: 1 })

    return {
      minDate: calendarDateToUnix(startOfLastYear),
      maxDate: calendarDateToUnix(
        startOfLastYear.add({ years: 1 }).subtract({ days: 1 })
      ),
    }
  },
}

export const dateRangeClear: DateRangeAction = {
  label: "Clear",
  action: () => {
    return {
      minDate: 0,
      maxDate: 0,
    }
  },
}

export const dateRangeActions: DateRangeAction[] = [
  dateRangeLast7Days,
  dateRangeLast30Days,
  dateRangeThisMonth,
  dateRangeLastMonth,
  dateRangeThisYear,
  dateRangeLastYear,
  dateRangeClear,
]
