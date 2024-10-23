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

    const cachedPrevMJSummaries = computed(() => store.getMJSummaries);

    return useQuery({
        queryKey: queryKey.value,
        queryFn: async () => {
            if (cachedPrevMJSummaries.value.length > 0) {
                return cachedPrevMJSummaries.value
            } else {
                const prevSummaries = await fetchMJAmountDebit(dateType)
                store.setMJSummaries(prevSummaries as unknown as MJSummary[])
                return prevSummaries
            }
        },
        refetchOnWindowFocus: false,
        enabled: !!store.selectedMonth || !!store.selectedWeek
    })
}
