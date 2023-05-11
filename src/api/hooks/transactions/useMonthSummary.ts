import {useQuery} from '@tanstack/vue-query'
import {MonthSummary} from "../../../types";
import {computed} from "vue";
import {useTransactionsStore} from "../../../stores/transactionsStore";
import {fetchMonthSummary} from "../../transactions/fetchMonthSummary";

export default function useMonthSummary() {
    const store = useTransactionsStore()
    const date = computed(() => store.getSelectedMonth)

    return useQuery<MonthSummary[]>(
        ['monthSummary', date.value],
        () => fetchMonthSummary(date.value),
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false
        })
}
