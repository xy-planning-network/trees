export interface DateRange {
  minDate: number
  maxDate: number
}

export interface DateRangeProps {
  help?: string
  label?: string
  maxDate?: Date | string | number
  maxRange?: number
  startDate?: Date | string | number
}
