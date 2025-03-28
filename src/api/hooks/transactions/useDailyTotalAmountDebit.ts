import {useQuery} from "@tanstack/vue-query";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {fetchDailyAmountDebitForInterval} from "@api/transactions/fetchDailyAmountDebitForInterval";
import type {DailyInterval} from "@types";
import type {ComputedRef, Ref} from "vue";

// TODO make reactive to selectedMonth or selectedWeek
// interval will be something like, '3 months', '6 months', '1 year', etc.
export function useDailyTotalAmountDebit(interval: Ref<string>, startDate: ComputedRef<string>): UseQueryReturnType<DailyInterval[], Error> {
    return useQuery({
        queryKey: ['daily-total-amount-debit-for-interval', interval?.value, startDate.value],
        queryFn: () => fetchDailyAmountDebitForInterval(interval?.value, startDate.value),
        refetchOnWindowFocus: false,
        enabled: !!interval
    })
}
