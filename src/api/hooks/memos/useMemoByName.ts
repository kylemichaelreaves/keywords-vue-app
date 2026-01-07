import { useQuery } from '@tanstack/vue-query'
import type { Memo } from '@types'
import { fetchMemos } from '@api/memos/fetchMemos.ts'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export default function useMemoByName(memoName: MaybeRefOrGetter<string>) {
  const memoNameValue = computed(() => toValue(memoName))
  const isValidMemoName = computed(() => {
    const name = memoNameValue.value
    return name !== undefined && name !== null && name.trim() !== ''
  })

  return useQuery<Memo | null>({
    queryKey: computed(() => ['memo', 'byName', memoNameValue.value]),
    queryFn: async (): Promise<Memo | null> => {
      const name = memoNameValue.value
      if (!name || name.trim() === '') {
        return null
      }

      const memos = await fetchMemos({ name, limit: 1 })
      return memos.length > 0 ? memos[0] ?? null : null
    },
    refetchOnWindowFocus: false,
    enabled: isValidMemoName,
    retry: 1,
    retryDelay: 50,
    staleTime: 0,
    gcTime: 0,
  })
}

