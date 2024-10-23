import {useQuery} from '@tanstack/vue-query';
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {fetchMonths} from "@api/transactions/fetchMonths";
import type {MonthYear} from "@types";
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";

export function useMonths(): UseQueryReturnType<MonthYear[], Error> {
    const store = useTransactionsStore();
    const cachedMonths = computed(() => store.getMonths);
    return useQuery<Array<MonthYear>>({
        queryKey: ['months'],
        queryFn: async () => {

            if (cachedMonths.value.length > 0) {
                return cachedMonths.value
            } else {
                const months = fetchMonths()
                store.setMonths(await months)
                return months
            }

        },
        refetchOnWindowFocus: false,
    })
}