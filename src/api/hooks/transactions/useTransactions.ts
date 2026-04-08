import { useInfiniteQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useTransactionsStore } from '@stores/transactions'
import { fetchTransactions } from '@api/transactions/fetchTransactions'
import { useTimeframeTypeAndValue } from '@api/hooks/timeUnits/useTimeframeTypeAndValue.ts'

import type { Transaction } from '@types'

export default function useTransactions() {
  const store = useTransactionsStore()
  const selectedMemo = computed(() => store.getSelectedMemo)
  const { timeFrame: dateType, selectedValue } = useTimeframeTypeAndValue()
  const limit = computed(() => store.getTransactionsTableLimit)

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

  return useInfiniteQuery<Array<Transaction>>({
    initialPageParam: 0,
    queryKey,
    queryFn: async ({ pageParam = 0 }) => {
      const memoValue = selectedMemo.value
      const isMemoId = memoValue && !Number.isNaN(Number(memoValue))

      let memoParam: { memoId?: number; memo?: string } = {}
      if (memoValue) {
        memoParam = isMemoId ? { memoId: Number(memoValue) } : { memo: memoValue }
      }

      return (await fetchTransactions({
        limit: limit.value,
        offset: Number(pageParam),
        ...memoParam,
        timeFrame: dateType.value,
        date: selectedValue.value,
      })) as Transaction[]
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
