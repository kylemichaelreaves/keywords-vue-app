import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { fetchTransactions } from '@api/transactions/fetchTransactions.ts'
import type { Timeframe } from '@types'

export const useBudgetCategoryAmountDebit = (
  budgetCategory: string,
  timeFrame: Timeframe,
  date: string,
  totalAmountDebit?: boolean,
): UseQueryReturnType<{ total_amount_debit: number }, Error> => {
  return useQuery({
    queryKey: ['budget-category-amount-debit', budgetCategory, timeFrame, date, totalAmountDebit],
    queryFn: () => fetchTransactions({ budgetCategory, timeFrame, date, totalAmountDebit }),
    refetchOnWindowFocus: false,
    enabled: Boolean(!!budgetCategory && !!date && date.trim() !== ''),
  })
}
