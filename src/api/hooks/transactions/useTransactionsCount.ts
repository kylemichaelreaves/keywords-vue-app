import { useQuery } from '@tanstack/vue-query'
import { useTransactionsStore } from '@stores/transactions'
import { fetchTransactionsCount } from '@api/transactions/fetchTransactionsCount'
import type { PendingTransactionStatus } from '@types'

// This hook is used for paginating the TransactionsTable
export default function useTransactionsCount(status?: PendingTransactionStatus) {
  const store = useTransactionsStore()
  const storeStatus = store.getSelectedStatus
  const statusQueryKey = status ?? storeStatus

  return useQuery({
    queryKey: ['transactions-count', statusQueryKey],
    queryFn: async () => {
      const data = await fetchTransactionsCount({ status })
      const count = data[0]?.count ?? 0
      store.setTransactionsCount(count)
      return count
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  })
}
