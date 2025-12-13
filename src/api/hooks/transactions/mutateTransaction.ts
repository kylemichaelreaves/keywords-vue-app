import { useMutation } from '@tanstack/vue-query'
import { updateTransaction } from '@api/transactions/updateTransaction'
import type { Transaction } from '@types'

export default function mutateTransaction() {
  return useMutation({
    mutationKey: ['mutate-transaction'],
    mutationFn: async ({ transaction }: { transaction: Transaction }) => {
      return updateTransaction(transaction)
    },
  })
}
