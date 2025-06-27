import type { UseQueryReturnType } from '@tanstack/vue-query'
import { useQuery } from '@tanstack/vue-query'
import { fetchTransactions } from '@api/transactions/fetchTransactions.ts'
import type { SummaryTypeBase, TimeframeType } from '@types'

export const useHistoricalSummaryForBudgetCategory = (budgetCategory: string,
                                                      timeFrame: TimeframeType,
                                                      date: string,
                                                      historical = true): UseQueryReturnType<SummaryTypeBase[], Error> => {
  return useQuery({
    queryKey: ['historical-summary-for-budget-category', budgetCategory],
    queryFn: () => fetchTransactions({ budgetCategory, timeFrame, date, historical }),
    refetchOnWindowFocus: false,
    enabled: !!budgetCategory
  })
}