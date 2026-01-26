import { useInfiniteQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useTransactionsStore } from '@stores/transactions'
import { fetchTransactions } from '@api/transactions/fetchTransactions'
import { useTimeframeTypeAndValue } from '@api/hooks/timeUnits/useTimeframeTypeAndValue.ts'

import type { Transaction } from '@types'

export default function useTransactions() {
  const store = useTransactionsStore()
  const selectedMemo = computed(() => store.getSelectedMemo)

  // Now these are reactive computed refs
  const { timeFrame: dateType, selectedValue } = useTimeframeTypeAndValue()

  const limit = computed(() => store.getTransactionsTableLimit)

  // Computed queryKey ensures proper reactivity tracking
  const queryKey = computed(
    () =>
      [
        'transactions',
        limit.value,
        selectedMemo.value,
        dateType.value,
        selectedValue.value,
      ] as const,
  )

  console.log('[useTransactions] Hook initialized with selectedMemo:', selectedMemo.value)

  return useInfiniteQuery<Array<Transaction>>({
    initialPageParam: 0,
    queryKey,
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
        const isMemoId = memoValue && !Number.isNaN(Number(memoValue))

        console.log('[useTransactions] memoValue:', memoValue, 'isMemoId:', isMemoId)

        let memoParam: { memoId?: number; memo?: string } = {}
        if (memoValue) {
          if (isMemoId) {
            memoParam = { memoId: Number(memoValue) }
          } else {
            memoParam = { memo: memoValue }
          }
        }

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
