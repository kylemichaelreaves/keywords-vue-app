import {useQuery} from '@tanstack/vue-query';
import {fetchWeeks} from "@api/transactions/fetchWeeks";
import type {WeekYear} from "@types";

export function useWeeks() {
    return useQuery<Array<WeekYear>>({
        queryKey: ['weeks'],
        queryFn: () => fetchWeeks(),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })
}