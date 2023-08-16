import {useQuery} from '@tanstack/vue-query';
import {fetchSummaries} from "../../transactions/fetchSummaries";
import {useTransactionsStore} from "../../../stores/transactionsStore";
import {Summaries} from "@types/types";
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
