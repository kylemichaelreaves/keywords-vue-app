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
    queryKey: [
      'pending-transactions',
      limit.value,
      selectedMemo.value,
      selectedStatus.value,
    ],
    queryFn: async ({ pageParam = 0 }) => {
      const cachedTransactions = store.getPendingTransactionsByOffset(Number(pageParam))
      if (cachedTransactions && cachedTransactions.length > 0) {
        return cachedTransactions
      } else {
        const transactions = await fetchPendingTransactions({
          limit: limit.value,
          offset: Number(pageParam),
          memo: selectedMemo.value ? String(selectedMemo.value) : undefined,
          status: selectedStatus.value || undefined,
        })
        store.setPendingTransactionsByOffset(
          Number(pageParam),
          transactions as PendingTransaction[],
        )
        return transactions
      }
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
