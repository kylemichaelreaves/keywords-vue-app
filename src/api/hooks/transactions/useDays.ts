import {useQuery} from "@tanstack/vue-query";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import type {DayYear} from "@types";
import {fetchDays} from "@api/transactions/fetchDays";
import {useTransactionsStore} from "@stores/transactions";

export const useDays = (): UseQueryReturnType<DayYear[], Error> => {
    const store = useTransactionsStore();

    return useQuery<Array<DayYear>>({
        queryKey: ['days'],
        queryFn: async () => {
            const days = fetchDays();
            store.setDays(await days);
            return days;
        },
        refetchOnWindowFocus: false,
    })
}
