import type { UseQueryReturnType } from '@tanstack/vue-query'
import { useQuery } from '@tanstack/vue-query'
import type { Memo } from '@types'
import { fetchMemo } from '@api/transactions/fetchMemo'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export default function useMemo(memoName: MaybeRefOrGetter<string>): UseQueryReturnType<Memo, Error> {
  const memoNameValue = computed(() => toValue(memoName))

  return useQuery<Memo>({
    queryKey: ['memo', memoNameValue],
    queryFn: async () => {
      const memoArray = await fetchMemo(memoNameValue.value)

      if (!memoArray || memoArray.length === 0) {
        throw new Error(`Memo with name "${memoNameValue.value}" not found`)
      }

      return memoArray[0]
    },
    refetchOnWindowFocus: false,
    enabled: computed(() => !!memoNameValue.value)
  })
}
