import {useQuery} from '@tanstack/vue-query'
import type {DaySummary} from "@types";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {computed} from "vue";
import {useTransactionsStore} from "@stores/transactions";
import {fetchDaySummary} from "@api/transactions/fetchDaySummary";

export default function useDaySummary(): UseQueryReturnType<DaySummary[], Error> {
    const store = useTransactionsStore()
    const day = computed(() => store.getSelectedDay)

    return useQuery<Array<DaySummary>>({
        queryKey: ['daySummary', day.value],
        queryFn: () => fetchDaySummary(day.value),
        enabled: !!day.value,
        refetchOnWindowFocus: false,
    })
}
