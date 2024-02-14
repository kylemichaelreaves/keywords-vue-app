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
        queryFn: () => fetchWeeks(),
        refetchOnWindowFocus: false,
    })
}