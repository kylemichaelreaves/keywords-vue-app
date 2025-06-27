import { useInfiniteQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useTransactionsStore } from '@stores/transactions'
import { fetchTransactions } from '@api/transactions/fetchTransactions'
import { getJSDateObject } from '@api/helpers/getJSDateObject'
import { getTimeframeTypeAndValue } from '@components/transactions/getTimeframeTypeAndValue.ts'
import type { Transaction } from '@types'

export default function useTransactions() {

  const store = useTransactionsStore()
  const selectedMemo = computed(() => store.getSelectedMemo)
  const dateTypeAndValue = computed(() => getTimeframeTypeAndValue())
  const dateType = computed(() => dateTypeAndValue.value.timeFrame)
  const selectedValue = computed(() => dateTypeAndValue.value.selectedValue)
  const limit = computed(() => store.getTransactionsTableLimit)

  const dateObj = computed(() => {
    return getJSDateObject(dateType.value, selectedValue.value)
  })

  return useInfiniteQuery<Array<Transaction>>({
    initialPageParam: 0,
    queryKey: ['transactions', limit.value, selectedMemo.value, dateType.value, selectedValue.value, dateObj.value],
    queryFn: async ({ pageParam = 0 }) => {
      const cachedTransactions = store.getTransactionsByOffset(Number(pageParam))
      if (cachedTransactions && cachedTransactions.length > 0) {
        return cachedTransactions
      } else {
        const transactions = await fetchTransactions({
          limit: limit.value,
          offset: Number(pageParam),
          memo: selectedMemo.value,
          timeFrame: dateType.value,
          date: dateObj.value
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
