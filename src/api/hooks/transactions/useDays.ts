import {useQuery} from "@tanstack/vue-query";
import type {UseQueryReturnType} from "@tanstack/vue-query";
import type {DayYear} from "@types";
import {fetchDays} from "@api/transactions/fetchDays";


export const useDays = (): UseQueryReturnType<DayYear[], Error> => {
    return useQuery<Array<DayYear>>({
        queryKey: ['days'],
        queryFn: () => fetchDays(),
        refetchOnWindowFocus: false,
    })
}