import {useQuery} from '@tanstack/vue-query';
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {fetchMonths} from "@api/transactions/fetchMonths";
import type {MonthYear} from "@types";
import {useTransactionsStore} from "@stores/transactions";

export function useMonths(): UseQueryReturnType<MonthYear[], Error> {
    const store = useTransactionsStore()
    return useQuery<Array<MonthYear>>({
        queryKey: ['months'],
        queryFn: async () => {
            const months = fetchMonths()
            store.setMonths(await months)
            return months
        },
        refetchOnWindowFocus: false,
    })
}