import { useQuery } from '@tanstack/vue-query'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useTransactionsStore } from '@stores/transactions.ts'
import { fetchWeeksOfMonth } from '@api/timeUnits/weeks/fetchWeeksOfMonth.ts'
import { fetchWeekSummary } from '@api/timeUnits/weeks/fetchWeekSummary.ts'
import type { WeekSummary } from '@types'

export default function useWeekSummariesForSelectedMonth(): UseQueryReturnType<
  Array<WeekSummary>,
  Error
> {
  const store = useTransactionsStore()
  const month = computed(() => store.getSelectedMonth)
  return useQuery<Array<WeekSummary>>({
    queryKey: computed(() => ['weekSummariesForSelectedMonth', month.value]),
    queryFn: async () => {
      const weeksOfMonth = await fetchWeeksOfMonth(month.value)
      store.setWeeksForSelectedMonth(weeksOfMonth)
      return Promise.all(weeksOfMonth.map((week: string) => fetchWeekSummary(week)))
    },
    enabled: computed(() => !!month.value),
    refetchOnWindowFocus: false,
  })
}
