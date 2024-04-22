import {useQuery} from '@tanstack/vue-query';
import type {UseQueryReturnType} from '@tanstack/vue-query';
import {fetchWeeks} from "@api/transactions/fetchWeeks";
import type {WeekYear} from "@types";
import {useTransactionsStore} from "@stores/transactions";

export const useWeeks = (): UseQueryReturnType<WeekYear[], Error> => {
    const store = useTransactionsStore()

    return useQuery<Array<WeekYear>>({
        queryKey: ['weeks'],
        queryFn: async () => {
            const weeks = fetchWeeks();
            store.setWeeks(await weeks)
            return weeks
        },
        refetchOnWindowFocus: false,
    })
}