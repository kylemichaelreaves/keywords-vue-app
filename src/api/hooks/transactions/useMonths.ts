import {useQuery} from '@tanstack/vue-query';
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {fetchMonths} from "@api/transactions/fetchMonths";
import type {MonthYear} from "@types";

export function useMonths():  UseQueryReturnType<MonthYear[], Error> {
    return useQuery<Array<MonthYear>>({
        queryKey: ['months'],
        queryFn: () => fetchMonths(),
        refetchOnWindowFocus: false,
    })
}