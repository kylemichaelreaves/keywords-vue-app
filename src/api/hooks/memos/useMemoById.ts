// useMemoById.ts - For finding specific memos by ID or name
import { useQuery } from '@tanstack/vue-query'
import { fetchMemos } from '@api/memos/fetchMemos.ts'
import type { Memo } from '@types'
import { computed, type Ref } from 'vue'

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
    queryKey: ['memo', { id: memoId.value, name: memoName.value }],
    queryFn: async () => {
      if (memoId.value) {
        const results = await fetchMemos({ id: memoId.value, limit: 1 })
        return results[0] || null
      }
      if (memoName.value) {
        const results = await fetchMemos({ name: memoName.value, limit: 1 })
        return results[0] || null
      }
      return null
    },
    enabled: !!(memoId.value || memoName.value),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}
