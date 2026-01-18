import { useQuery } from '@tanstack/vue-query'
import type { Memo } from '@types'
import { fetchMemo } from '@api/memos/fetchMemo.ts'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export default function useMemo(memoId: MaybeRefOrGetter<number>) {
  const memoIdValue = computed(() => toValue(memoId))
  const memoIdIsNeitherUndefinedNorNull =
    memoIdValue.value !== undefined && memoIdValue.value !== null

  return useQuery({
    queryKey: computed(() => ['memo', memoIdValue.value]),
    queryFn: async (): Promise<Memo> => {
      return await fetchMemo(memoIdValue.value)
    },
    refetchOnWindowFocus: false,
    enabled: memoIdIsNeitherUndefinedNorNull,
    retry: 1,
    retryDelay: 50,
    staleTime: 0,
    gcTime: 0,
  })
}
