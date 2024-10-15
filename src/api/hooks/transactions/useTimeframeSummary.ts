import { useQuery } from '@tanstack/vue-query';
import type { UseQueryReturnType } from '@tanstack/vue-query';
import { computed } from 'vue';
import { fetchTimeframeSummary } from '@api/transactions/fetchTimeframeSummary';
import { useTransactionsStore } from '@stores/transactions';

export default function useTimeframeSummary(date: Date): UseQueryReturnType<number, Error> {
    const store = useTransactionsStore();

    // Determine the timeframe based on the selected values in the store
    const timeframe = computed(() => {
        if (store.getSelectedDay) {
            return "day";
        } else if (store.getSelectedWeek) {
            return "week";
        } else if (store.getSelectedMonth) {
            return "month";
        } else if (store.getSelectedYear) {
            return "year";
        } else {
            return undefined; // Return undefined if no valid timeframe is selected
        }
    });

    // Generate the query key based on timeframe and date
    const queryKey = computed(() => ['timeframeSummary', timeframe.value, date]);

    return useQuery<number>({
        queryKey: queryKey.value,
        queryFn: () => {
            if (!timeframe.value) {
                // Throw an error if no valid timeframe is selected
                return Promise.reject(new Error("No valid timeframe selected"));
            }

            return fetchTimeframeSummary(timeframe.value, date);
        },
        refetchOnWindowFocus: false,
        enabled: !!timeframe.value // Enable query only when a valid timeframe is selected
    });
}
