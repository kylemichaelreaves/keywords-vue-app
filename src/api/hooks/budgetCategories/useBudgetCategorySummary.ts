import { useQuery } from '@tanstack/vue-query'
import { fetchTransactions } from '@api/transactions/fetchTransactions.ts'
import type { Timeframe } from '@types'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export const useBudgetCategorySummary = (
  timeFrame: MaybeRefOrGetter<Timeframe>,
  date: MaybeRefOrGetter<string>,
) => {
  // Convert to reactive values
  const reactiveTimeFrame = computed(() => toValue(timeFrame))
  const reactiveDate = computed(() => toValue(date))

  return useQuery({
    queryKey: ['budget-category-summary', reactiveTimeFrame, reactiveDate],
    queryFn: () => {
      const currentTimeFrame = reactiveTimeFrame.value
      const currentDate = reactiveDate.value

      console.log('useBudgetCategorySummary: Fetching data', {
        timeFrame: currentTimeFrame,
        date: currentDate,
      })

      return fetchTransactions({
        budgetCategoryHierarchySum: true,
        timeFrame: currentTimeFrame,
        date: currentDate,
      })
    },
    refetchOnWindowFocus: false,
    enabled: computed(() => {
      const hasTimeFrame = !!reactiveTimeFrame.value
      const hasDate = !!reactiveDate.value
      console.log('useBudgetCategorySummary: Query enabled check', {
        hasTimeFrame,
        hasDate,
        timeFrame: reactiveTimeFrame.value,
        date: reactiveDate.value,
      })
      return hasTimeFrame && hasDate
    }),
  })
}
