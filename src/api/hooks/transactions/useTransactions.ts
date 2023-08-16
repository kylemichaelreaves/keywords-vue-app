import {useQuery} from '@tanstack/vue-query'
import {fetchTransactions} from '../../transactions/fetchTransactions'
import {Transaction} from "@types/types";
import {computed, Ref, UnwrapRef} from "vue";
import {useTransactionsStore} from "../../../stores/transactionsStore";
import {parseDateMMYYYY} from "../../helpers/dataUtils";
import {parseDateIWIYYY} from "../../helpers/parseDateIWIYYY";

export default function useTransactions(LIMIT = 100, OFFSET?: UnwrapRef<number>) {

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
