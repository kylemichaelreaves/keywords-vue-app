// useMemoById.ts - For finding specific memos by ID or name
import { useQuery } from '@tanstack/vue-query'
import { fetchMemo } from '@api/memos/fetchMemo.ts'
import { fetchMemos } from '@api/memos/fetchMemos.ts'
import type { Memo } from '@types'
import { computed, type Ref } from 'vue'
import { devConsole } from '@utils/devConsole'

interface UseMemoByIdParams {
  memoId?: Ref<number | null> | number | null
  memoName?: Ref<string | null> | string | null
}

export function useMemoById(params: UseMemoByIdParams) {
  const memoId = computed(() =>
    typeof params.memoId === 'number' ? params.memoId : params.memoId?.value || null,
  )

  const memoName = computed(() =>
    typeof params.memoName === 'string' ? params.memoName : params.memoName?.value || null,
  )

  return useQuery<Memo | null>({
    queryKey: computed(() => ['memo', { id: memoId.value, name: memoName.value }]),
    queryFn: async () => {
      devConsole('log', '🟣 useMemoById: queryFn called', {
        memoId: memoId.value,
        memoName: memoName.value,
      })
      if (memoId.value) {
        // Use fetchMemo for direct ID lookup
        const result = await fetchMemo(memoId.value)
        devConsole('log', '🟣 useMemoById: fetchMemo by ID returned', result)
        return result || null
      }
      if (memoName.value) {
        // Use fetchMemos for name-based search
        const results = await fetchMemos({ name: memoName.value, limit: 1 })
        devConsole('log', '🟣 useMemoById: fetchMemos by name returned', results)
        return results[0] || null
      }
      devConsole('log', '🟣 useMemoById: no memoId or memoName, returning null')
      return null
    },
    enabled: computed(() => !!(memoId.value || memoName.value)),
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache
  })
}
