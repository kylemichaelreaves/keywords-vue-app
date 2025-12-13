import { useQuery } from '@tanstack/vue-query'
import { fetchBudgetCategories } from '@api/budgetCategories/fetchBudgetCategories.ts'
import type { Timeframe } from '@types'

export const useBudgetCategories = (timeframe?: Timeframe, date?: string, flatten = false) => {
  return useQuery({
    queryKey: ['budgetCategories', flatten, timeframe, date],
    queryFn: () => fetchBudgetCategories(flatten, timeframe, date),
    refetchOnWindowFocus: false,
    // FIX: Add validation for optional date parameter
    enabled: Boolean(!date || (date && date.trim() !== '')),
  })
}
