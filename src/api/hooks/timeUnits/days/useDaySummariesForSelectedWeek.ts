import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useTransactionsStore } from '@stores/transactions.ts'
import { fetchDaysOfWeek } from '@api/timeUnits/days/fetchDaysOfWeek.ts'
import { fetchDaySummary } from '@api/timeUnits/days/fetchDaySummary.ts'

export function useDaySummariesForSelectedWeek() {
  const store = useTransactionsStore()
  const week = computed(() => store.getSelectedWeek)
  return useQuery({
    queryKey: ['day-summaries-for-selected-week', week.value],
    queryFn: async () => {
      // get the days of the week
      const daysOfWeek = await fetchDaysOfWeek(week.value)
      // Wait for all the daySummaries to be fetched, then return them
      return Promise.all(daysOfWeek.map((day: string) => fetchDaySummary(day)))
    },
    enabled: Boolean(week.value),
    refetchOnWindowFocus: false,
  })
}
