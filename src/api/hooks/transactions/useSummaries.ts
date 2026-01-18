import { useQuery } from '@tanstack/vue-query'
import { fetchSummaries } from '@api/transactions/fetchSummaries'
import type { Summaries } from '@types'
import { getTimeframeTypeAndValue } from '@components/transactions/helpers/getTimeframeTypeAndValue.ts'
import { computed } from 'vue'
import { useTransactionsStore } from '@stores/transactions'

// builds the summary table for the interval,
// like monthly or weekly, and returns:
// the total amount debit, total amount credit, and their difference for each interval
export default function useSummaries() {
  const { timeFrame, selectedValue } = getTimeframeTypeAndValue()
  const store = useTransactionsStore()

  const cachedSummaries = computed(() => {
    switch (timeFrame) {
      case 'day':
        return store.getDaysSummaries
      case 'week':
        return store.getWeeksSummaries
      case 'month':
        return store.getMonthsSummaries
      default:
        return null
    }
  })

  return useQuery({
    queryKey: ['summaries', timeFrame, selectedValue] as const,
    queryFn: async (): Promise<Summaries[]> => {
      if (cachedSummaries.value && cachedSummaries.value.length > 0) {
        return cachedSummaries.value
      } else {
        const summaries = await fetchSummaries(timeFrame)

        if (!summaries || !Array.isArray(summaries)) {
          return []
        }

        switch (timeFrame) {
          case 'day':
            store.setDaysSummaries(summaries)
            break
          case 'week':
            store.setWeeksSummaries(summaries)
            break
          case 'month':
            store.setMonthsSummaries(summaries)
            break
        }
        return summaries
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!selectedValue,
  })
}
