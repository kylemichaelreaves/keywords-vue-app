import {useQuery, type UseQueryReturnType} from '@tanstack/vue-query'
import {fetchSumAmountDebitByDate} from "@api/transactions/fetchSumAmountDebitByDate";
import {parseDateIWIYYY} from "@api/helpers/parseDateIWIYYY";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";
import {parseDateDDMMYYYY} from "@api/helpers/parseDateDDMMYYYY"; // new helper function
import {parseDateYYYY} from "@api/helpers/parseDateYYYY"; // new helper function
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";

export default function useSumAmountDebitByDate(timeFrame: string, date: string): UseQueryReturnType<any, Error> {

    const store = useTransactionsStore()
    const selectedDay = computed(() => store.getSelectedDay) // new computed property
    const selectedWeek = computed(() => store.getSelectedWeek)
    const selectedMonth = computed(() => store.getSelectedMonth)
    const selectedYear = computed(() => store.getSelectedYear) // new computed property

    const dateType = computed(() => {
        if (selectedDay.value) return "day";
        if (selectedWeek.value) return "week";
        if (selectedMonth.value) return "month";
        if (selectedYear.value) return "year";
    });

    return useQuery({
        queryKey: ['sumAmountDebitByDate', timeFrame, date],
        queryFn: () => {
            let dateObj: Date | null | undefined;
            if (dateType.value === "day" && selectedDay.value) {
                dateObj = parseDateDDMMYYYY(selectedDay.value); // use new helper function
            } else if (dateType.value === "week" && selectedWeek.value) {
                dateObj = parseDateIWIYYY(selectedWeek.value);
            } else if (dateType.value === "month" && selectedMonth.value) {
                dateObj = parseDateMMYYYY(selectedMonth.value);
            } else if (dateType.value === "year" && selectedYear.value) {
                dateObj = parseDateYYYY(selectedYear.value); // use new helper function
            }
            return fetchSumAmountDebitByDate(timeFrame, dateObj);
        },
        refetchOnWindowFocus: false
    })
}