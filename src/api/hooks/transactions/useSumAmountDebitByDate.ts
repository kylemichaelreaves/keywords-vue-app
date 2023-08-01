import {useQuery} from '@tanstack/vue-query'
import {fetchSumAmountDebitByDate} from "../../transactions/fetchSumAmountDebitByDate";
import {parseDateIWIYYY} from "../../helpers/parseDateIWIYYY";
import {parseDateMMYYYY} from "../../helpers/dataUtils";
import {useTransactionsStore} from "../../../stores/transactionsStore";
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