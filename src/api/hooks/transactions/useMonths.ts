import {useQuery} from '@tanstack/vue-query';
import {fetchMonths} from "@api/transactions/fetchMonths";
import type {MonthYear} from "@types";

export function useMonths() {
    return useQuery<Array<MonthYear>>({
        queryKey: ['months'],
        queryFn: () => fetchMonths(),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })
}