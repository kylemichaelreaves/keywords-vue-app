import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { fetchTransactions } from '@api/transactions/fetchTransactions.ts'
import type { TimeframeType } from '@types'

export const useBudgetCategoryAmountDebit = (
  budgetCategory: string,
  timeFrame: TimeframeType,
  date: string,
  totalAmountDebit?: boolean
): UseQueryReturnType<{total_amount_debit: number}, Error> => {
  return useQuery({
    queryKey: ['budget-category-amount-debit', budgetCategory, timeFrame, date, totalAmountDebit],
    queryFn: () => fetchTransactions({ budgetCategory, timeFrame, date, totalAmountDebit }),
    refetchOnWindowFocus: false,
    enabled: !!budgetCategory
  })
}