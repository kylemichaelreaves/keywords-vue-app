import {useQuery} from '@tanstack/vue-query'
import {fetchTransactions} from '@api/transactions/fetchTransactions'
import type {Transaction} from "@types";
import {computed} from "vue";
import {useTransactionsStore} from "@stores/transactions";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";
import {parseDateIWIYYY} from "@api/helpers/parseDateIWIYYY";

// TODO refactor limit - limit should be the length of the records for that query
export default function useTransactions(LIMIT = 100, OFFSET?: number) {

    const store = useTransactionsStore()
    const selectedMemo = computed(() => store.getSelectedMemo)
    const selectedMonth = computed(() => store.getSelectedMonth)
    const selectedWeek = computed(() => store.getSelectedWeek)
    const dateType = computed(() => selectedWeek.value ? "week" : "month");
    const queryKey = computed(() => ['transactions', LIMIT, OFFSET, selectedMemo.value, dateType.value, selectedMonth.value, selectedWeek.value]);

    return useQuery<Array<Transaction>>({
        queryKey: queryKey.value,
        queryFn: () => {
            // Convert the date string to a Date object based on the dateType
            // TODO - include a case for dateType === "year" && dateType === "day"
            let dateObj: Date | null | undefined;
            if (dateType.value === "week") {
                dateObj = selectedWeek.value ? parseDateIWIYYY(selectedWeek.value) : null;
            } else if (dateType.value === "month") {
                dateObj = selectedMonth.value ? parseDateMMYYYY(selectedMonth.value) : null;
            }
            return fetchTransactions(LIMIT, OFFSET, selectedMemo.value, dateType.value, dateObj);
        },
        keepPreviousData: true,
        refetchOnWindowFocus: false
    })
}
