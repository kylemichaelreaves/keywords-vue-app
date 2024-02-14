import {useQuery} from '@tanstack/vue-query'
import type {UseQueryReturnType} from "@tanstack/vue-query";
import {fetchOFAmountDebit} from "@api/transactions/fetchOFAmountDebit";
import {useTransactionsStore} from "@stores/transactions";
import {computed} from "vue";
import {parseDateIWIYYY} from "@api/helpers/parseDateIWIYYY";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";
import type {OFSummary} from "@types";

// Get the Amount Debit for Memo's fitting the OF category, for a certain period of time
export default function useOFAmountDebit(): UseQueryReturnType<OFSummary[], Error> {

    const store = useTransactionsStore()

    const selectedMonth = computed(() => store.getSelectedMonth)
    const selectedWeek = computed(() => store.getSelectedWeek)
    const timeFrame = computed(() => selectedWeek.value ? "week" : "month");
    const queryKey = computed(() => ['OFAmountDebit', timeFrame.value, selectedMonth.value, selectedWeek.value]);

    return useQuery({
        queryKey: queryKey.value,
        queryFn: () => {

            let dateObj: Date | null | undefined;
            if (timeFrame.value === "week" && selectedWeek.value) {
                dateObj = parseDateIWIYYY(selectedWeek.value);
            } else if (timeFrame.value === "month" && selectedMonth.value) {
                dateObj = parseDateMMYYYY(selectedMonth.value);
            }
            return fetchOFAmountDebit(timeFrame.value, dateObj);
        },
        refetchOnWindowFocus: false
    })
}