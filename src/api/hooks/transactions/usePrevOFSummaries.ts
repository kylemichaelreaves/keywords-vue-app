import {useQuery} from '@tanstack/vue-query'
import {fetchOFAmountDebit} from "@api/transactions/fetchOFAmountDebit";
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";
import type {OFSummary} from "@types";
import type {UseQueryReturnType} from "@tanstack/vue-query";

export function usePrevOFSummaries(): UseQueryReturnType<OFSummary[], Error> {
    const store = useTransactionsStore()

    const dateType = computed(() => "month");
    const queryKey = computed(() => ['PrevOFSummaries', dateType.value]);

    return useQuery({
        queryKey: queryKey.value,
        queryFn: () => fetchOFAmountDebit(dateType.value),
        refetchOnWindowFocus: false,
        enabled: Boolean(store.selectedMonth) || Boolean(store.selectedWeek)
    })
}
