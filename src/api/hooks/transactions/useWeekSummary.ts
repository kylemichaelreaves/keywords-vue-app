import {useQuery} from '@tanstack/vue-query'
import {WeekSummary} from "@/types";
import {fetchWeekSummary} from "../../transactions/fetchWeekSummary";
import {computed} from "vue";
import {useTransactionsStore} from "../../../stores/transactionsStore";

export default function useWeekSummary() {
    const store = useTransactionsStore()
    const week = computed(() => store.getSelectedWeek)

    return useQuery<WeekSummary[]>({
        queryKey: ['weekSummary', week.value],
        queryFn: () => fetchWeekSummary(week.value),
        keepPreviousData: true,
        refetchOnWindowFocus: false
    })
}
