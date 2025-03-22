import { useInfiniteQuery } from '@tanstack/vue-query'
import { fetchMemos } from '@api/transactions/fetchMemos'
import type { Memo } from '@types'
import { useTransactionsStore } from '@stores/transactions'
import { computed } from 'vue'

export default function useMemos() {

  const store = useTransactionsStore()
  const memosTableLimit = computed(() => store.getMemosTableLimit)

  return useInfiniteQuery<Array<Memo>>({
    initialPageParam: 0,
    queryKey: ['memos', memosTableLimit.value],
    queryFn: async ({ pageParam = 0 }) => {
      const cachedMemos = computed(() => store.getMemosByOffset(Number(pageParam)))
      if (cachedMemos.value.length > 0) {
        return cachedMemos.value
      } else {
        const memos = await fetchMemos({
          limit: memosTableLimit.value,
          offset: Number(pageParam)
        })
        store.setMemosByOffset(Number(pageParam), memos)
        return memos
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < memosTableLimit.value) {
        return undefined
      }
      return allPages.length * memosTableLimit.value
    },
    refetchOnWindowFocus: false
  })
}
