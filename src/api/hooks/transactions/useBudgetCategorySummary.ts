import { useQuery } from '@tanstack/vue-query'
import { fetchTransactions } from '@api/transactions/fetchTransactions.ts'
import type { TimeframeType } from '@types'

export const useBudgetCategorySummary = (
  timeFrame: TimeframeType,
  date: string
) => {
  return useQuery({
    queryKey: ['budget-category-summary', timeFrame, date],
    queryFn: () => fetchTransactions({
      budgetCategoryHierarchySum: true,
      timeFrame,
      date
    }),
    refetchOnWindowFocus: false,
    enabled: Boolean(!!timeFrame && !!date)
  })
}