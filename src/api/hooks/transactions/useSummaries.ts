import {useQuery} from '@tanstack/vue-query';
import {fetchSummaries} from "@/api/transactions/fetchSummaries";
import {useTransactionsStore} from "@/stores/transactionsStore";
import type {Summaries} from "@/types";
import {computed} from "vue";

export default function useSummaries() {
    const store = useTransactionsStore();
    const selectedMonth = computed(() => store.getSelectedMonth);
    const selectedWeek = computed(() => store.getSelectedWeek);

    return useQuery<Array<Summaries>>(
        {
            queryKey: ['summaries'],
            queryFn: () => {
                if (selectedWeek.value && selectedWeek.value !== '') {
                    return fetchSummaries("week");
                } else if (selectedMonth.value && selectedMonth.value !== '') {
                    return fetchSummaries("month");
                } else {
                    return Promise.reject(new Error("Neither week nor month is selected"));
                }
            },
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            enabled: !!selectedMonth.value || !!selectedWeek.value
        });
}
