import {useQuery} from '@tanstack/vue-query'
import {fetchSumAmountDebitByDate} from "@api/transactions/fetchSumAmountDebitByDate";
import {parseDateIWIYYY} from "@api/helpers/parseDateIWIYYY";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";

export default function useSumAmountDebitByDate(timeFrame: string, date: string) {

    const store = useTransactionsStore()

    const selectedMonth = computed(() => store.getSelectedMonth)
    const selectedWeek = computed(() => store.getSelectedWeek)
    const dateType = computed(() => selectedWeek.value ? "week" : "month");

    return useQuery({
        queryKey: ['sumAmountDebitByDate', timeFrame, date],
        queryFn: () => {
            let dateObj: Date | null | undefined;
            if (dateType.value === "week" && selectedWeek.value) {
                dateObj = parseDateIWIYYY(selectedWeek.value);
            } else if (dateType.value === "month" && selectedMonth.value) {
                dateObj = parseDateMMYYYY(selectedMonth.value);
            }
            return fetchSumAmountDebitByDate(timeFrame, dateObj);
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false
    })
}