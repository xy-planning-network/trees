export interface DateRange {
  minDate: number
  maxDate: number
}

export interface DateRangeProps {
  help?: string
  label?: string
  maxDateOpt?: Date | string | number | undefined 
  maxRange?: number
  startDate?: number
}
