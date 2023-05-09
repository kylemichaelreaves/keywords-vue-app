import {useQuery} from '@tanstack/vue-query'
import {WeekSummary} from "../../../types";
import {fetchWeekSummary} from "../../transactions/fetchWeekSummary";

export default function useWeekSummary(date: string) {
    return useQuery<WeekSummary[]>({
        queryKey: ['weekSummary', date],
        queryFn: () => fetchWeekSummary(date),
        keepPreviousData: true,
        refetchOnWindowFocus: false
    })
}
