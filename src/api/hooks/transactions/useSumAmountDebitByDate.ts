import { useQuery, type UseQueryReturnType } from '@tanstack/vue-query'
import { fetchSumAmountDebitByDate } from '@api/transactions/fetchSumAmountDebitByDate'
import { computed, type MaybeRefOrGetter, toValue } from 'vue'

export default function useSumAmountDebitByDate(
  timeFrame: MaybeRefOrGetter<string>,
  date: MaybeRefOrGetter<string>,
): UseQueryReturnType<Array<{ total_amount_debit: number }>, Error> {
  const timeFrameValue = computed(() => toValue(timeFrame))
  const dateValue = computed(() => toValue(date))

  return useQuery({
    queryKey: ['sum-amount-debit-by-date', timeFrameValue, dateValue],
    queryFn: () => fetchSumAmountDebitByDate(timeFrameValue.value, dateValue.value),
    refetchOnWindowFocus: false,
    enabled: computed(() => !!dateValue.value && dateValue.value.trim() !== ''),
  })
}
