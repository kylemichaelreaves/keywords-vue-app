import { useInfiniteQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useTransactionsStore } from '@stores/transactions'
import { fetchPendingTransactions } from '@api/transactions/fetchPendingTransactions'
import type { PendingTransaction } from '@types'

export default function usePendingTransactions() {
  const store = useTransactionsStore()
  const selectedMemo = computed(() => store.getSelectedMemo)
  const selectedStatus = computed(() => store.getSelectedStatus)
  const limit = computed(() => store.getTransactionsTableLimit)

  return useInfiniteQuery<Array<PendingTransaction>>({
    initialPageParam: 0,
    queryKey: computed(
      () => ['pending-transactions', limit.value, selectedMemo.value, selectedStatus.value] as const,
    ),
    queryFn: async ({ pageParam = 0 }) => {
      const memoValue = selectedMemo.value
      const isMemoId = memoValue && !Number.isNaN(Number(memoValue))

      const memoParam = memoValue
        ? isMemoId
          ? { memoId: Number(memoValue) }
          : { memo: memoValue }
        : {}

      return (await fetchPendingTransactions({
        limit: limit.value,
        offset: Number(pageParam),
        ...memoParam,
        status: selectedStatus.value || undefined,
      })) as PendingTransaction[]
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit.value) {
        return undefined
      }
      return allPages.length * limit.value
    },
    refetchOnWindowFocus: false,
  })
}
