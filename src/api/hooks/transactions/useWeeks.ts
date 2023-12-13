import {useQuery} from '@tanstack/vue-query';
import type {UseQueryReturnType} from '@tanstack/vue-query';
import {fetchWeeks} from "@api/transactions/fetchWeeks";
import type {WeekYear} from "@types";

export const useWeeks = (): UseQueryReturnType<WeekYear[], Error> => {
    return useQuery<Array<WeekYear>>({
        queryKey: ['weeks'],
        queryFn: () => fetchWeeks(),
        refetchOnWindowFocus: false,
    })
}