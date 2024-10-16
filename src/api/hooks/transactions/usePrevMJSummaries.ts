import {useQuery} from '@tanstack/vue-query'
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";
import {fetchMJAmountDebit} from "@api/transactions/fetchMJAmountDebit";
import type {MJSummary} from "@types";
import {getDateType} from "@components/transactions/getDateType";

export function usePrevMJSummaries(): UseQueryReturnType<MJSummary[], Error> {
    const store = useTransactionsStore()
    const dateType = getDateType();
    const queryKey = computed(() => ['PrevMJSummaries', dateType]);

    return useQuery({
        queryKey: queryKey.value,
        queryFn: () => fetchMJAmountDebit(dateType),
        refetchOnWindowFocus: false,
        enabled: !!store.selectedMonth || !!store.selectedWeek
    })
}
