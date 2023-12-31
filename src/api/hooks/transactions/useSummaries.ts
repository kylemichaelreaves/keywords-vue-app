import {useQuery} from '@tanstack/vue-query';
import {fetchSummaries} from "@api/transactions/fetchSummaries";
import {useTransactionsStore} from "@stores/transactions";
import type {Summaries} from "@types";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {computed} from "vue";

export default function useSummaries(): UseQueryReturnType<Summaries[], Error> {
    const store = useTransactionsStore();
    const selectedDay = computed(() => store.getSelectedDay);
    const selectedWeek = computed(() => store.getSelectedWeek);
    const selectedMonth = computed(() => store.getSelectedMonth);

    return useQuery<Array<Summaries>>(
        {
            queryKey: ['summaries'],
            queryFn: () => {
                if (selectedDay.value && selectedDay.value !== '') {
                    return fetchSummaries("day");
                } else if (selectedWeek.value && selectedWeek.value !== '') {
                    return fetchSummaries("week");
                } else if (selectedMonth.value && selectedMonth.value !== '') {
                    return fetchSummaries("month");
                } else {
                    return Promise.reject(new Error("Neither week nor month is selected"));
                }
            },
            refetchOnWindowFocus: false,
            enabled: !!selectedMonth.value || !!selectedWeek.value || !!selectedDay.value
        });
}
