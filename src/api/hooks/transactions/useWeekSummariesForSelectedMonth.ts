import {useQuery} from '@tanstack/vue-query'
import type {UseQueryReturnType} from '@tanstack/vue-query'
import {computed} from "vue";
import {useTransactionsStore} from "@stores/transactions";
import {fetchWeeksOfMonth} from "@api/transactions/fetchWeeksOfMonth";
import {fetchWeekSummary} from "@api/transactions/fetchWeekSummary";
import type {WeekSummary} from "@types";

export default function useWeekSummariesForSelectedMonth(){
    const store = useTransactionsStore()
    const month = computed(() => store.getSelectedMonth)

    return useQuery({
        queryKey: ['weekSummariesForSelectedMonth', month.value],
        queryFn: async () => {
            const weeksOfMonth = await fetchWeeksOfMonth(month.value)
            store.setWeeksForSelectedMonth(weeksOfMonth)
            return Promise.all(weeksOfMonth.map((week: string) => fetchWeekSummary(week)));
        },
        enabled: !!month.value,
        refetchOnWindowFocus: false,
    })
}