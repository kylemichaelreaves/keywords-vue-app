import type { UseQueryReturnType } from '@tanstack/vue-query'
import { useQuery } from '@tanstack/vue-query'
import { fetchDailyAmountDebitForInterval } from '@api/timeUnits/days/fetchDailyAmountDebitForInterval.ts'
import type { SummaryTypeBase } from '@types'
import type { ComputedRef, Ref } from 'vue'
import { computed } from 'vue'

export function useDailyTotalAmountDebit(
  interval: Ref<string>,
  startDate: Ref<string | null> | ComputedRef<string | null>,
): UseQueryReturnType<SummaryTypeBase[], Error> {
  return useQuery({
    queryKey: computed(() => [
      'daily-total-amount-debit-for-interval',
      interval.value,
      startDate.value,
    ]),
    queryFn: async () => {
      return await fetchDailyAmountDebitForInterval(interval.value, startDate.value)
    },
    refetchOnWindowFocus: false,
    staleTime: 0, // Always consider data stale to ensure fresh fetches
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes
    enabled: computed(() => {
      return !!interval.value && !!startDate.value && startDate.value.trim() !== ''
    }),
  })
}
