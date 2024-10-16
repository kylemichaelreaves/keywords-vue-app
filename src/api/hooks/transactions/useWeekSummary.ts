import {useQuery} from '@tanstack/vue-query'
import type {WeekSummary} from "@types";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {fetchWeekSummary} from "@api/transactions/fetchWeekSummary";
import {computed} from "vue";
import {useTransactionsStore} from "@stores/transactions";

export default function useWeekSummary(): UseQueryReturnType<WeekSummary[], Error> {
    const store = useTransactionsStore()
    const week = computed(() => store.getSelectedWeek)
    return useQuery<WeekSummary[]>({
        queryKey: ['weekSummary', week.value],
        queryFn: () => fetchWeekSummary(week.value),
        enabled: !!week.value,
        refetchOnWindowFocus: false
    })
}
