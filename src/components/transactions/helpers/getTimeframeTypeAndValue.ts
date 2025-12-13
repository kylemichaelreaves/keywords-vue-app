import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useTransactionsStore } from '@stores/transactions.ts'
import { Timeframe } from '@types'

export const getTimeframeTypeAndValue = (): {
  timeFrame: Timeframe
  selectedValue: ComputedRef<string> | null
} => {
  const store = useTransactionsStore()

  // Define computed properties for selected values
  const selectedDay = computed(() => store.getSelectedDay)
  const selectedWeek = computed(() => store.getSelectedWeek)
  const selectedMonth = computed(() => store.getSelectedMonth)
  const selectedYear = computed(() => store.getSelectedYear)

  // Determine the date dateType and corresponding value
  if (selectedDay.value) {
    return { timeFrame: Timeframe.Day, selectedValue: selectedDay }
  } else if (selectedWeek.value) {
    return { timeFrame: Timeframe.Week, selectedValue: selectedWeek }
  } else if (selectedMonth.value) {
    return { timeFrame: Timeframe.Month, selectedValue: selectedMonth }
  } else {
    return { timeFrame: Timeframe.Year, selectedValue: selectedYear }
  }
}
