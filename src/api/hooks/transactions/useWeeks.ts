import { useQuery } from '@tanstack/vue-query';
import type { UseQueryReturnType } from '@tanstack/vue-query';
import { fetchWeeks } from "@api/transactions/fetchWeeks";
import type { WeekYear } from "@types";
import { useTransactionsStore } from "@stores/transactions";
import { computed } from "vue";

export const useWeeks = (): UseQueryReturnType<WeekYear[], Error> => {
    const transactionsStore = useTransactionsStore();
    const selectedMonth = computed(() => transactionsStore.selectedMonth);

    return useQuery<Array<WeekYear>>({
        queryKey: ['weeks'],
        queryFn: () => fetchWeeks().then(weeks => {
            if (selectedMonth.value) {
                const [month, year] = selectedMonth.value.split('/');
                weeks = weeks.filter(week => {
                    const [weekMonth, weekYear] = week.week_year.split('/');
                    return weekYear === year && weekMonth === month;
                });
            }
            return weeks;
        }),
        refetchOnWindowFocus: false,
    })
}