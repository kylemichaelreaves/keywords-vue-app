import { useQuery } from '@tanstack/vue-query'
import { fetchSummaries } from '@api/transactions/fetchSummaries'
import type { Summaries } from '@types'
import { getTimeframeTypeAndValue } from '@components/transactions/getTimeframeTypeAndValue.ts'
import { computed } from 'vue'
import { useTransactionsStore } from '@stores/transactions'

// builds the summary table for the interval,
// like monthly or weekly, and returns:
// the total amount debit, total amount credit, and their difference for each interval
export default function useSummaries() {

  const { timeFrame, selectedValue } = getTimeframeTypeAndValue()
  const store = useTransactionsStore()

  // eslint-disable-next-line vue/return-in-computed-property
  const cachedSummaries = computed(() => {
    switch (timeFrame) {
      case 'day':
        return store.getDaysSummaries
      case 'week':
        return store.getWeeksSummaries
      case 'month':
        // console.log('store.getMonthsSummaries', store.getMonthsSummaries);
        return store.getMonthsSummaries
    }
  })


  return useQuery<Array<Summaries>>({
    queryKey: ['summaries', timeFrame, selectedValue],
    queryFn: () => {
      if (cachedSummaries.value && cachedSummaries?.value?.length > 0) {
        // console.log('cachedSummaries.value', cachedSummaries.value);
        return cachedSummaries.value
      } else {
        return fetchSummaries(timeFrame)
          .then((summaries) => {
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
          })
      }
    },
    refetchOnWindowFocus: false,
    enabled: !!selectedValue
    // staleTime: 1000 * 60 * 5, // five minutes
  })
}
