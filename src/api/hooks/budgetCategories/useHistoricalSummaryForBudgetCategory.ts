import type { UseQueryReturnType } from '@tanstack/vue-query'
import { useQuery } from '@tanstack/vue-query'
import { fetchTransactions } from '@api/transactions/fetchTransactions.ts'
import type { SummaryTypeBase, Timeframe } from '@types'

export const useHistoricalSummaryForBudgetCategory = (
  budgetCategory: string,
  timeFrame: Timeframe,
  date: string,
  historical = true,
): UseQueryReturnType<SummaryTypeBase[], Error> => {
  return useQuery({
    queryKey: ['historical-summary-for-budget-category', budgetCategory],
    queryFn: () => fetchTransactions({ budgetCategory, timeFrame, date, historical }),
    refetchOnWindowFocus: false,
    enabled: !!budgetCategory && !!date && date.trim() !== '',
  })
}
