import {useQuery} from '@tanstack/vue-query'
import type {WeekSummary} from "@types";
import {fetchWeekSummary} from "@api/transactions/fetchWeekSummary";
import {computed} from "vue";
import {useTransactionsStore} from "@stores/transactions";

export default function useWeekSummary() {
    const store = useTransactionsStore()
    const week = computed(() => store.getSelectedWeek)

    return useQuery<WeekSummary[]>({
        queryKey: ['weekSummary', week.value],
        queryFn: () => fetchWeekSummary(week.value),
        keepPreviousData: true,
        refetchOnWindowFocus: false
    })
}
