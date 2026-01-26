import { useQuery } from '@tanstack/vue-query'
import type { MonthSummary } from '@types'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { computed } from 'vue'
import { useTransactionsStore } from '@stores/transactions.ts'
import { fetchMonthSummary } from '@api/timeUnits/months/fetchMonthSummary.ts'

// useMonthSummary returns every memo and their total amount debit for the selected month
export default function useMonthSummary(): UseQueryReturnType<MonthSummary[], Error> {
  const store = useTransactionsStore()
  const month = computed(() => store.getSelectedMonth)

  return useQuery<Array<MonthSummary>>({
    queryKey: computed(() => ['month-summary', month.value]),
    queryFn: () => fetchMonthSummary(month.value),
    enabled: computed(() => Boolean(!!month.value && month.value.trim() !== '')),
    refetchOnWindowFocus: false,
  })
}
