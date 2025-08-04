import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { fetchSumAmountDebitByDate } from '@api/transactions/fetchSumAmountDebitByDate'

export default function useSumAmountDebitByDate(timeFrame: string, date: string): UseQueryReturnType<Array<{
  total_amount_debit: number
}>, Error> {
  return useQuery({
    queryKey: ['sum-amount-debit-by-date', timeFrame, date],
    queryFn: () => {
      return fetchSumAmountDebitByDate(timeFrame, date)
    },
    refetchOnWindowFocus: false,
    enabled: !!date && date.trim() !== ''
  })
}