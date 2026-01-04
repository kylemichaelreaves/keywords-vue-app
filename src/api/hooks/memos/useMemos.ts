// useMemos.ts - For paginated tables/lists
import { useInfiniteQuery } from '@tanstack/vue-query'
import { fetchMemos } from '@api/memos/fetchMemos.ts'
import type { Memo, MemoQueryParams } from '@types'
import { computed, type Ref } from 'vue'
import { Timeframe } from '@types'

interface UseMemosParams {
  date?: Ref<string> | string
  timeFrame?: Ref<string> | string
  count?: Ref<boolean> | boolean
  limit?: Ref<number> | number
}

export function useMemos(params: UseMemosParams = {}) {
  const date = computed(() =>
    typeof params.date === 'string' ? params.date : params.date?.value || '',
  )
  const timeFrame = computed(() =>
    typeof params.timeFrame === 'string' ? params.timeFrame : params.timeFrame?.value || '',
  )
  const count = computed(() =>
    typeof params.count === 'boolean' ? params.count : params.count?.value,
  )
  const limit = computed(() =>
    typeof params.limit === 'number' ? params.limit : params.limit?.value || 20,
  )

  return useInfiniteQuery<Array<Memo>>({
    initialPageParam: 0,
    queryKey: [
      'memos',
      { limit: limit.value, date: date.value, timeFrame: timeFrame.value, count: count.value },
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const queryParams: MemoQueryParams = {
        limit: limit.value,
        offset: Number(pageParam),
      }

      if (date.value) queryParams.date = date.value
      if (timeFrame.value) queryParams.timeFrame = timeFrame.value as Timeframe
      if (count.value !== undefined) queryParams.count = count.value

      return await fetchMemos(queryParams)
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit.value) return undefined
      return allPages.length * limit.value
    },
    refetchOnWindowFocus: false,
  })
}
