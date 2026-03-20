import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updatePendingTransaction } from '@api/transactions/updatePendingTransaction'
import type { PendingTransaction } from '@types'
import { useTransactionsStore } from '@stores/transactions'
import { devConsole } from '@utils/devConsole'

export default function mutatePendingTransaction() {
  const queryClient = useQueryClient()
  const store = useTransactionsStore()

  return useMutation({
    mutationKey: ['mutate-pending-transaction'],
    mutationFn: async ({
      pendingTransactionId,
      pendingTransaction,
    }: {
      pendingTransactionId: number
      pendingTransaction: PendingTransaction
    }) => {
      return updatePendingTransaction(pendingTransactionId, pendingTransaction)
    },
    onSuccess: async () => {
      devConsole('log', 'Mutation successful, clearing store cache and invalidating queries')
      // Clear the store cache so the query will fetch fresh data
      store.clearPendingTransactionsByOffset()
      devConsole('log', 'Store cache cleared')
      // Invalidate and refetch pending transactions query
      await queryClient.invalidateQueries({
        queryKey: ['pending-transactions'],
        refetchType: 'active',
      })
      devConsole('log', 'Queries invalidated and refetched')
    },
  })
}
