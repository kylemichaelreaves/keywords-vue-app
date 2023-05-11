import {useQuery} from '@tanstack/vue-query'
import {fetchSumAmountDebitByDate} from "../../transactions/fetchSumAmountDebitByDate";

export default function useSumAmountDebitByDate(timeFrame: string, date: string) {
    return useQuery({
        queryKey: ['sumAmountDebitByDate', timeFrame, date],
        queryFn: () => fetchSumAmountDebitByDate(timeFrame, date),
        keepPreviousData: true,
        refetchOnWindowFocus: false
    })
}