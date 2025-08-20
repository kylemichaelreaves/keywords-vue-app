import {useQuery} from "@tanstack/vue-query";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {fetchDailyAmountDebitForInterval} from "@api/transactions/fetchDailyAmountDebitForInterval";
import type { SummaryTypeBase } from '@types'
import type {ComputedRef, Ref } from "vue";
import { computed } from "vue";

export function useDailyTotalAmountDebit(
  interval: Ref<string>,
  startDate: Ref<string | null> | ComputedRef<string | null>
): UseQueryReturnType<SummaryTypeBase[], Error> {
  return useQuery({
    queryKey: ['daily-total-amount-debit-for-interval', interval, startDate],
    queryFn: () => {
      console.log('[useDailyTotalAmountDebit DEBUG] Executing queryFn with:', {
        interval: interval.value,
        startDate: startDate.value
      })
      return fetchDailyAmountDebitForInterval(interval.value, startDate.value)
    },
    refetchOnWindowFocus: false,
    enabled: computed(() => {
      const isEnabled = !!interval.value && !!startDate.value && startDate.value.trim() !== ''
      console.log('[useDailyTotalAmountDebit DEBUG] Hook enabled check:', {
        interval: interval.value,
        startDate: startDate.value,
        isEnabled
      })
      return isEnabled
    })
  })
}