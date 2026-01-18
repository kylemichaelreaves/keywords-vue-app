import { useInfiniteQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useTransactionsStore } from '@stores/transactions'
import { fetchTransactions } from '@api/transactions/fetchTransactions'
import { getTimeframeTypeAndValue } from '@components/transactions/helpers/getTimeframeTypeAndValue.ts'
import type { Transaction } from '@types'

export default function useTransactions() {
  const store = useTransactionsStore()
  const selectedMemo = computed(() => store.getSelectedMemo)
  const dateTypeAndValue = computed(() => getTimeframeTypeAndValue())
  const dateType = computed(() => dateTypeAndValue.value.timeFrame)
  const selectedValue = computed(() => {
    const value = dateTypeAndValue.value.selectedValue
    return value ? value.value : undefined
  })
  const limit = computed(() => store.getTransactionsTableLimit)

  console.log('[useTransactions] Hook initialized with selectedMemo:', selectedMemo.value)

  return useInfiniteQuery<Array<Transaction>>({
    initialPageParam: 0,
    // Pass computed refs directly - Vue Query will unwrap and track them automatically
    queryKey: ['transactions', limit, selectedMemo, dateType, selectedValue] as const,
    queryFn: async ({ pageParam = 0 }) => {
      console.log(
        '[useTransactions] queryFn called with pageParam:',
        pageParam,
        'selectedMemo:',
        selectedMemo.value,
      )
      const cachedTransactions = store.getTransactionsByOffset(Number(pageParam))
      if (cachedTransactions && cachedTransactions.length > 0) {
        return cachedTransactions
      } else {
        const memoValue = selectedMemo.value
        // Determine if we have a memo ID (numeric) or memo name (string)
        const isMemoId = memoValue && !Number.isNaN(Number(memoValue))

        console.log('[useTransactions] memoValue:', memoValue, 'isMemoId:', isMemoId)

        // Build memo parameter based on type
        const memoParam = memoValue
          ? isMemoId
            ? { memoId: Number(memoValue) }
            : { memo: memoValue }
          : {}

        console.log('[useTransactions] memoParam:', memoParam)

        const transactions = await fetchTransactions({
          limit: limit.value,
          offset: Number(pageParam),
          ...memoParam,
          timeFrame: dateType.value,
          date: selectedValue.value,
        })
        store.setTransactionsByOffset(Number(pageParam), transactions as Transaction[])
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
