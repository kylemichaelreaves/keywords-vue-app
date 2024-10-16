import {useQuery} from '@tanstack/vue-query'
import type {MonthSummary} from "@types";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {computed} from "vue";
import {useTransactionsStore} from "@stores/transactions";
import {fetchMonthSummary} from "@api/transactions/fetchMonthSummary";

export default function useMonthSummary(): UseQueryReturnType<MonthSummary[], Error> {
    const store = useTransactionsStore()
    const month = computed(() => store.getSelectedMonth)
    return useQuery<Array<MonthSummary>>({
        queryKey: ['monthSummary', month.value],
        queryFn: () => fetchMonthSummary(month.value),
        enabled: !!month.value,
        refetchOnWindowFocus: false,
    })
}
