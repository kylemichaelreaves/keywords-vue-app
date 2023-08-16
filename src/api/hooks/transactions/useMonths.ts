import {useQuery} from '@tanstack/vue-query';
import {fetchMonths} from "../../transactions/fetchMonths";
import {MonthYear} from "@types/types";

export function useMonths() {
    return useQuery<Array<MonthYear>>({
        queryKey: ['months'],
        queryFn: () => fetchMonths(),
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    })
}