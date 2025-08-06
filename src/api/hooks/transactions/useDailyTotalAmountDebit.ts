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
    queryFn: () => fetchDailyAmountDebitForInterval(interval.value, startDate.value),
    refetchOnWindowFocus: false,
    enabled: computed(() => !!interval.value && !!startDate.value && startDate.value.trim() !== '')
  })
}