import { useQuery } from '@tanstack/vue-query'
import type { DaySummary } from '@types'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useTransactionsStore } from '@stores/transactions.ts'
import { fetchDaySummary } from '@api/timeUnits/days/fetchDaySummary.ts'

export default function useDaySummary(): UseQueryReturnType<DaySummary[], Error> {
  const store = useTransactionsStore()
  const day = computed(() => store.getSelectedDay)
  return useQuery<Array<DaySummary>>({
    queryKey: ['daySummary', day.value],
    queryFn: async () => {
      return fetchDaySummary(day.value)
    },
    enabled: !!day.value,
    refetchOnWindowFocus: false,
  })
}
