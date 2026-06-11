import { DateRangeAction } from "@/entry"

export interface DateRange {
  minDate: number
  maxDate: number
}

export interface DateRangeProps {
  actions?: DateRangeAction[]
  maxRange?: number
  maxValue?: Date
  minValue?: Date
}
