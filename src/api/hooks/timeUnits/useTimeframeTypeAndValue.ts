import { computed, type ComputedRef } from 'vue'
import { useTransactionsStore } from '@stores/transactions.ts'
import { Timeframe } from '@types'

export const useTimeframeTypeAndValue = (): {
  timeFrame: ComputedRef<Timeframe>
  selectedValue: ComputedRef<string | undefined>
} => {
  const store = useTransactionsStore()

  const selectedDay = computed(() => store.getSelectedDay)
  const selectedWeek = computed(() => store.getSelectedWeek)
  const selectedMonth = computed(() => store.getSelectedMonth)
  const selectedYear = computed(() => store.getSelectedYear)

  const timeFrame = computed(() => {
    if (selectedDay.value) return Timeframe.Day
    if (selectedWeek.value) return Timeframe.Week
    if (selectedMonth.value) return Timeframe.Month
    return Timeframe.Year
  })

  const selectedValue = computed(() => {
    if (selectedDay.value) return selectedDay.value
    if (selectedWeek.value) return selectedWeek.value
    if (selectedMonth.value) return selectedMonth.value
    return selectedYear.value
  })

  return { timeFrame, selectedValue }
}

// Keep for backwards compatibility, but prefer useTimeframeTypeAndValue
export const getTimeframeTypeAndValue = useTimeframeTypeAndValue
