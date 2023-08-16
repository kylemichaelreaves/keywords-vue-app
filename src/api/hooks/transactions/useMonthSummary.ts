import {useQuery} from '@tanstack/vue-query'
import {MonthSummary} from "@types/types";
import {computed} from "vue";
import {useTransactionsStore} from "../../../stores/transactionsStore";
import {fetchMonthSummary} from "../../transactions/fetchMonthSummary";

export default function useMonthSummary() {
    const store = useTransactionsStore()
    const month = computed(() => store.getSelectedMonth)

    return useQuery<MonthSummary[]>(
        ['monthSummary', month.value],
        () => fetchMonthSummary(month.value),
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            enabled: !!month.value
        })
}
