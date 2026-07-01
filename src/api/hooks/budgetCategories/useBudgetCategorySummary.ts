import { useQuery } from '@tanstack/vue-query'
import { fetchTransactions } from '@api/transactions/fetchTransactions.ts'
import type { Timeframe } from '@types'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export const useBudgetCategorySummary = (
  timeFrame: MaybeRefOrGetter<Timeframe>,
  date: MaybeRefOrGetter<string>,
) => {
  const reactiveTimeFrame = computed(() => toValue(timeFrame))
  const reactiveDate = computed(() => toValue(date))

  return useQuery({
    queryKey: ['budget-category-summary', reactiveTimeFrame, reactiveDate],
    queryFn: () =>
      fetchTransactions({
        budgetCategoryHierarchySum: true,
        timeFrame: reactiveTimeFrame.value,
        date: reactiveDate.value,
      }),
    refetchOnWindowFocus: false,
    enabled: computed(() => !!reactiveTimeFrame.value && !!reactiveDate.value),
  })
}
