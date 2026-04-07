import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { updatePendingTransaction } from '@api/transactions/updatePendingTransaction'
import type { PendingTransaction } from '@types'

export default function mutatePendingTransaction() {
  const queryClient = useQueryClient()

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
      await queryClient.invalidateQueries({
        queryKey: ['pending-transactions'],
        refetchType: 'active',
      })
    },
  })
}
