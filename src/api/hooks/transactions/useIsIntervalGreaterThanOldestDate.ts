import { useQuery } from '@tanstack/vue-query'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { fetchIsIntervalGreaterThanOldestDate } from '@api/transactions/fetchIsIntervalGreaterThanOIdestDate'
import type { ComputedRef } from 'vue'

export function useIsIntervalGreaterThanOldestDate(
  interval: ComputedRef<string>,
): UseQueryReturnType<{ is_out_of_range: boolean }[], Error> {
  return useQuery({
    queryKey: ['is-interval-greater-than-oldest-date', interval],
    queryFn: () => fetchIsIntervalGreaterThanOldestDate(interval.value),
    refetchOnWindowFocus: false,
    enabled: !!interval,
  })
}
