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

    const cachedPrevOFSummaries = computed(() => store.getOFSummaries);

    return useQuery({
        queryKey: queryKey.value,
        queryFn: async () => {
            if (cachedPrevOFSummaries.value.length > 0) {
                return cachedPrevOFSummaries.value
            } else {
                const prevSummaries = await fetchOFAmountDebit(dateType.value)
                store.setOFSummaries(prevSummaries as unknown as OFSummary[])
                return prevSummaries
            }
        },
        refetchOnWindowFocus: false,
        enabled: Boolean(store.selectedMonth) || Boolean(store.selectedWeek)
    })
}
