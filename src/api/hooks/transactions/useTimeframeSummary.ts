import {useQuery} from '@tanstack/vue-query'
import type {UseQueryReturnType} from '@tanstack/vue-query'
import {computed} from "vue";
import {fetchTimeframeSummary} from '@api/transactions/fetchTimeframeSummary'
import {useTransactionsStore} from "@stores/transactions";

export default function useTimeframeSummary(date: Date): UseQueryReturnType<number, Error> {

    const store = useTransactionsStore()

    const timeframe = computed(() => {
        if (store.getSelectedDay) {
            return "day"
        } else if (store.getSelectedWeek) {
            return "week"
        } else if (store.getSelectedMonth) {
            return "month"
        } else if (store.getSelectedYear) {
            return "year"
        }
    })

    return useQuery<number>({
        queryKey: ['timeframeSummary'],
        queryFn: () => fetchTimeframeSummary(timeframe?.value, date),
        refetchOnWindowFocus: false
    })
}
