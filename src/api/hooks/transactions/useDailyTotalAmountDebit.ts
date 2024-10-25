import {useQuery} from "@tanstack/vue-query";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {fetchDailyAmountDebitForInterval} from "@api/transactions/fetchDailyAmountDebitForInterval";
import type {DailyInterval} from "@types";

// interval will be something like, '3 months', '6 months', '1 year', etc.
export function useDailyTotalAmountDebit(interval: string): UseQueryReturnType<DailyInterval[], Error> {
    return useQuery({
        queryKey: ['daily-total-amount-debit-for-interval', interval],
        queryFn: async () => {
            return fetchDailyAmountDebitForInterval(interval);
        },
        refetchOnWindowFocus: false,
        enabled: !!interval
    })
}
