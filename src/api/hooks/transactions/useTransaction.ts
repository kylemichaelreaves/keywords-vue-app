import { useQuery } from '@tanstack/vue-query'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'
import type { Transaction } from '@types'
import { fetchTransaction } from '@api/transactions/fetchTransaction'

export default function useTransaction(
  transactionNumber: MaybeRefOrGetter<Transaction['id']>,
): UseQueryReturnType<Transaction, Error> {
  return useQuery<Transaction>({
    queryKey: computed(() => ['transaction', toValue(transactionNumber)]),
    queryFn: () => fetchTransaction(toValue(transactionNumber)!),
    enabled: computed(() => {
      const val = toValue(transactionNumber)
      return val != null && Number.isFinite(val)
    }),
    refetchOnWindowFocus: false,
  })
}
