import {useQuery} from '@tanstack/vue-query'
import {fetchMJAmountDebit} from "../../transactions/fetchMJAmountDebit";
import {useTransactionsStore} from "../../../stores/transactionsStore";
import {computed} from "vue";
import {parseDateIWIYYY} from "../../helpers/parseDateIWIYYY";
import {parseDateMMYYYY} from "../../helpers/dataUtils";

// Get the Amount Debit for Memo's fitting the MJ category, for a certain period of time
export default function useMJAmountDebit() {

    const store = useTransactionsStore()
    const selectedMonth = computed(() => store.getSelectedMonth)
    const selectedWeek = computed(() => store.getSelectedWeek)
    const timeFrame = computed(() => selectedWeek.value ? "week" : "month");
    const queryKey = computed(() => ['MJAmountDebit', timeFrame.value, selectedMonth.value, selectedWeek.value]);

    return useQuery({
        queryKey: queryKey.value,
        queryFn: () => {

            let dateObj: Date | null | undefined;
            if (timeFrame.value === "week" && selectedWeek.value) {
                dateObj = parseDateIWIYYY(selectedWeek.value);
            } else if (timeFrame.value === "month" && selectedMonth.value && selectedMonth.value !== '' && selectedMonth.value !== undefined) {
                dateObj = parseDateMMYYYY(selectedMonth.value);
            }
            return fetchMJAmountDebit(timeFrame.value, dateObj);
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false,
        enabled: selectedMonth.value !== ''
    })
}