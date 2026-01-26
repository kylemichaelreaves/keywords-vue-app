import { useQuery } from '@tanstack/vue-query'
import type { WeekSummary } from '@types'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { fetchWeekSummary } from '@api/timeUnits/weeks/fetchWeekSummary.ts'
import { computed } from 'vue'
import { useTransactionsStore } from '@stores/transactions.ts'

export default function useWeekSummary(): UseQueryReturnType<WeekSummary[], Error> {
  const store = useTransactionsStore()
  const week = computed(() => store.getSelectedWeek)
  return useQuery<WeekSummary[]>({
    queryKey: computed(() => ['week-summary', week.value]),
    queryFn: () => fetchWeekSummary(week.value),
    enabled: computed(() => Boolean(!!week.value && week.value.trim() !== '')),
    refetchOnWindowFocus: false,
  })
}
