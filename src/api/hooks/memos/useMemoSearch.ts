// useMemoSearch.ts - For autocomplete/search
import { useQuery } from '@tanstack/vue-query'
import { fetchMemos } from '@api/memos/fetchMemos.ts'
import type { Memo } from '@types'
import { computed, type Ref } from 'vue'

interface UseMemoSearchParams {
  searchQuery: Ref<string> | string
  limit?: number
  enabled?: Ref<boolean> | boolean
}

export function useMemoSearch(params: UseMemoSearchParams) {
  const searchQuery = computed(() =>
    typeof params.searchQuery === 'string' ? params.searchQuery : params.searchQuery?.value || '',
  )

  const enabled = computed(() =>
    typeof params.enabled === 'boolean' ? params.enabled : (params.enabled?.value ?? true),
  )

  return useQuery<Array<Memo>>({
    queryKey: ['memos', 'search', searchQuery.value],
    queryFn: async () => {
      if (!searchQuery.value) {
        return await fetchMemos({ limit: params.limit || 50 })
      }
      return await fetchMemos({
        name: searchQuery.value,
        limit: params.limit || 50,
      })
    },
    enabled: enabled.value,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
