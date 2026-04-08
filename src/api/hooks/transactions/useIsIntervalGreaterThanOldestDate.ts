import { useQuery } from '@tanstack/vue-query'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { fetchIsIntervalGreaterThanOldestDate } from '@api/transactions/fetchIsIntervalGreaterThanOIdestDate'
import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

export function useIsIntervalGreaterThanOldestDate(
  interval: MaybeRefOrGetter<string>,
): UseQueryReturnType<{ is_out_of_range: boolean }[], Error> {
  return useQuery({
    queryKey: computed(() => ['is-interval-greater-than-oldest-date', toValue(interval)]),
    queryFn: () => fetchIsIntervalGreaterThanOldestDate(toValue(interval)),
    refetchOnWindowFocus: false,
    enabled: computed(() => !!toValue(interval)),
  })
}
