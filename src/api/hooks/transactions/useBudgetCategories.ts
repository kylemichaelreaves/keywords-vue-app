import { useQuery } from '@tanstack/vue-query'
import { fetchBudgetCategories } from '@api/transactions/fetchBudgetCategories'
import type { TimeframeType } from '@types'

export const useBudgetCategories = (timeframe?: TimeframeType, date?: string, flatten = false) => {
  return useQuery({
    queryKey: ['budgetCategories', flatten, timeframe, date],
    queryFn: () => fetchBudgetCategories(flatten, timeframe, date),
    refetchOnWindowFocus: false
  })
}