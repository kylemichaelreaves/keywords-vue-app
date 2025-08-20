import type { UseQueryReturnType } from '@tanstack/vue-query'
import { useQuery } from '@tanstack/vue-query'
import type { Memo } from '@types'
import { fetchMemo } from '@api/transactions/fetchMemo'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export default function useMemo(memoName: MaybeRefOrGetter<string>): UseQueryReturnType<Memo, Error> {
  const memoNameValue = computed(() => toValue(memoName))

  return useQuery<Memo>({
    queryKey: computed(() => ['memo', memoNameValue.value]), // Wrap in computed to ensure proper reactivity
    queryFn: async () => {
      console.log('useMemo: Fetching memo for:', memoNameValue.value)

      if (!memoNameValue.value || memoNameValue.value.trim() === '') {
        throw new Error('Memo name is required')
      }

      const memoArray = await fetchMemo(memoNameValue.value)
      console.log('useMemo: Received memo data:', memoArray)

      if (!memoArray || memoArray.length === 0) {
        throw new Error(`Memo with name "${memoNameValue.value}" not found`)
      }

      return memoArray[0]
    },
    refetchOnWindowFocus: false,
    enabled: computed(() => Boolean(!!memoNameValue.value && memoNameValue.value.trim() !== '')),
    retry: 1, // Reduce retries in tests
    retryDelay: 50,
    staleTime: 0, // Always refetch to avoid cache issues in tests
    gcTime: 0, // Don't cache results to avoid race conditions
  })
}
